import cors from 'cors';
import express from 'express';
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env from project root
const envPath = resolve(__dirname, '..', '.env');
try {
    const envContent = readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const [key, ...vals] = line.split('=');
        if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
    });
} catch { /* .env optional */ }

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '20mb' }));

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const RECIPE_PROMPT = `You are a professional chef. Look at this food image carefully.

1. Identify the dish name
2. List all ingredients with quantities
3. Provide step-by-step cooking instructions
4. Estimate nutritional information per serving

Reply with ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "dishName": "Name of the dish",
  "cuisine": "Italian/Indian/Chinese/etc",
  "ingredients": [
    {"name": "ingredient name", "quantity": "amount with unit"}
  ],
  "recipe": {
    "servings": 4,
    "prepTime": "15 mins",
    "cookTime": "30 mins",
    "difficulty": "Easy/Medium/Hard",
    "steps": [
      "Step 1 description",
      "Step 2 description"
    ]
  },
  "nutrition": {
    "calories": 450,
    "protein": "28g",
    "carbs": "55g",
    "fat": "12g",
    "fiber": "4g"
  }
}`;

function buildRecipeByNamePrompt(dishName) {
    return 'You are a professional chef. The user wants to cook "' + dishName + '".\n\n' +
        '1. Confirm the dish name\n' +
        '2. List all ingredients with exact quantities\n' +
        '3. Provide detailed step-by-step cooking instructions\n' +
        '4. Estimate nutritional information per serving\n\n' +
        'Reply with ONLY valid JSON in this exact format (no markdown, no code fences):\n' +
        '{\n' +
        '  "dishName": "' + dishName + '",\n' +
        '  "cuisine": "Italian/Indian/Chinese/etc",\n' +
        '  "ingredients": [\n' +
        '    {"name": "ingredient name", "quantity": "amount with unit"}\n' +
        '  ],\n' +
        '  "recipe": {\n' +
        '    "servings": 4,\n' +
        '    "prepTime": "15 mins",\n' +
        '    "cookTime": "30 mins",\n' +
        '    "difficulty": "Easy/Medium/Hard",\n' +
        '    "steps": [\n' +
        '      "Step 1 description",\n' +
        '      "Step 2 description"\n' +
        '    ]\n' +
        '  },\n' +
        '  "nutrition": {\n' +
        '    "calories": 450,\n' +
        '    "protein": "28g",\n' +
        '    "carbs": "55g",\n' +
        '    "fat": "12g",\n' +
        '    "fiber": "4g"\n' +
        '  }\n' +
        '}';
}

// ===== POST /api/generate-recipe =====
app.post('/api/generate-recipe', async (req, res) => {
    try {
        const { dishName } = req.body;

        if (!dishName || !dishName.trim()) {
            return res.status(400).json({ error: 'No dish name provided' });
        }

        console.log('[Server] Received recipe generation request for:', dishName);
        const prompt = buildRecipeByNamePrompt(dishName.trim());

        let aiText = null;

        // Try OpenRouter first
        const orKey = process.env.OPENROUTER_API_KEY;
        if (orKey) {
            console.log('[Server] Trying OpenRouter for recipe generation...');
            try {
                const response = await fetch(OPENROUTER_URL, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + orKey,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'http://localhost:5173',
                        'X-Title': 'Smart Recipe Generator'
                    },
                    body: JSON.stringify({
                        model: 'openrouter/free',
                        messages: [{
                            role: 'user',
                            content: prompt
                        }],
                        max_tokens: 2048,
                        temperature: 0.3
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    aiText = data.choices?.[0]?.message?.content || '';
                    console.log('[OpenRouter] Recipe response received, length:', aiText.length);
                } else {
                    const err = await response.text().catch(() => '');
                    console.error('[OpenRouter] Error:', response.status, err);
                }
            } catch (err) {
                console.error('[OpenRouter] Fetch error:', err.message);
            }
        }

        // Fallback to Gemini
        if (!aiText) {
            const gemKey = process.env.GEMINI_API_KEY;
            if (gemKey) {
                console.log('[Server] Trying Gemini for recipe generation...');
                try {
                    const response = await fetch(GEMINI_URL + '?key=' + gemKey, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{ text: prompt }]
                            }],
                            generationConfig: { temperature: 0.3, maxOutputTokens: 2048 }
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const candidate = data.candidates?.[0];
                        if (candidate && candidate.finishReason !== 'SAFETY') {
                            aiText = candidate.content?.parts?.[0]?.text || '';
                            console.log('[Gemini] Recipe response received, length:', aiText.length);
                        }
                    } else {
                        console.error('[Gemini] Error:', response.status);
                    }
                } catch (err) {
                    console.error('[Gemini] Fetch error:', err.message);
                }
            }
        }

        if (!aiText) {
            return res.status(502).json({ error: 'Could not get AI response. Check API keys.' });
        }

        const parsed = parseAIResponse(aiText);
        console.log('[Server] Generated recipe:', parsed.dishName, '| Steps:', parsed.recipe?.steps?.length);

        res.json(parsed);

    } catch (err) {
        console.error('[Server] Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ===== POST /api/analyze-image =====
app.post('/api/analyze-image', async (req, res) => {
    try {
        const { image, mimeType } = req.body;

        if (!image) {
            return res.status(400).json({ error: 'No image data provided' });
        }

        console.log('[Server] Received image analysis request');

        let aiText = null;

        // Try OpenRouter first
        const orKey = process.env.OPENROUTER_API_KEY;
        if (orKey) {
            console.log('[Server] Trying OpenRouter...');
            try {
                const dataUrl = 'data:' + (mimeType || 'image/jpeg') + ';base64,' + image;
                const response = await fetch(OPENROUTER_URL, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + orKey,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'http://localhost:5175',
                        'X-Title': 'Smart Recipe Generator'
                    },
                    body: JSON.stringify({
                        model: 'openrouter/free',
                        messages: [{
                            role: 'user',
                            content: [
                                { type: 'text', text: RECIPE_PROMPT },
                                { type: 'image_url', image_url: { url: dataUrl } }
                            ]
                        }],
                        max_tokens: 2048,
                        temperature: 0.2
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    aiText = data.choices?.[0]?.message?.content || '';
                    console.log('[OpenRouter] Response received, length:', aiText.length);
                } else {
                    const err = await response.text().catch(() => '');
                    console.error('[OpenRouter] Error:', response.status, err);
                }
            } catch (err) {
                console.error('[OpenRouter] Fetch error:', err.message);
            }
        }

        // Fallback to Gemini
        if (!aiText) {
            const gemKey = process.env.GEMINI_API_KEY;
            if (gemKey) {
                console.log('[Server] Trying Gemini...');
                for (let attempt = 1; attempt <= 3; attempt++) {
                    try {
                        const response = await fetch(GEMINI_URL + '?key=' + gemKey, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                contents: [{
                                    parts: [
                                        { text: RECIPE_PROMPT },
                                        { inlineData: { mimeType: mimeType || 'image/jpeg', data: image } }
                                    ]
                                }],
                                generationConfig: { temperature: 0.2, maxOutputTokens: 2048 }
                            })
                        });

                        if (response.status === 429 && attempt < 3) {
                            console.log('[Gemini] Rate limited, retrying in ' + (attempt * 5) + 's...');
                            await new Promise(r => setTimeout(r, attempt * 5000));
                            continue;
                        }

                        if (response.ok) {
                            const data = await response.json();
                            const candidate = data.candidates?.[0];
                            if (candidate && candidate.finishReason !== 'SAFETY') {
                                aiText = candidate.content?.parts?.[0]?.text || '';
                                console.log('[Gemini] Response received, length:', aiText.length);
                            }
                        } else {
                            console.error('[Gemini] Error:', response.status);
                        }
                        break;
                    } catch (err) {
                        console.error('[Gemini] Fetch error:', err.message);
                        break;
                    }
                }
            }
        }

        if (!aiText) {
            return res.status(502).json({ error: 'Could not get AI response. Check API keys.' });
        }

        // Parse the AI response
        const parsed = parseAIResponse(aiText);
        console.log('[Server] Parsed dish:', parsed.dishName, '| Ingredients:', parsed.ingredients?.length);

        res.json(parsed);

    } catch (err) {
        console.error('[Server] Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ===== GET /api/health =====
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ===== Parse AI text into structured JSON =====
function parseAIResponse(text) {
    if (!text) return { dishName: 'Unknown Dish', ingredients: [], recipe: { steps: [] }, nutrition: {} };

    // Strip markdown code fences
    let clean = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

    // Try direct JSON parse
    try {
        const parsed = JSON.parse(clean);
        if (parsed.dishName) return normalizeRecipe(parsed);
    } catch { /* continue */ }

    // Try to find JSON object in text
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) {
        try {
            const parsed = JSON.parse(match[0]);
            if (parsed.dishName) return normalizeRecipe(parsed);
        } catch { /* continue */ }
    }

    // Last resort: extract what we can
    console.log('[Server] Could not parse JSON, raw text:', clean.substring(0, 300));
    return {
        dishName: 'Detected Dish',
        ingredients: extractIngredientsList(clean),
        recipe: { servings: 4, prepTime: 'N/A', cookTime: 'N/A', steps: [clean] },
        nutrition: {},
        rawResponse: clean
    };
}

function normalizeRecipe(parsed) {
    return {
        dishName: parsed.dishName || 'Unknown Dish',
        cuisine: parsed.cuisine || '',
        ingredients: (parsed.ingredients || []).map(i =>
            typeof i === 'string' ? { name: i, quantity: '' } : { name: i.name || i, quantity: i.quantity || '' }
        ),
        recipe: {
            servings: parsed.recipe?.servings || 4,
            prepTime: parsed.recipe?.prepTime || '',
            cookTime: parsed.recipe?.cookTime || '',
            difficulty: parsed.recipe?.difficulty || 'Medium',
            steps: parsed.recipe?.steps || []
        },
        nutrition: parsed.nutrition || {}
    };
}

function extractIngredientsList(text) {
    const items = text
        .replace(/[\[\]"']/g, '')
        .split(/[,\n]+/)
        .map(s => s.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim())
        .filter(s => s.length > 1 && s.length < 80);
    return [...new Set(items)].map(name => ({ name, quantity: '' }));
}

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`\n🍳 Smart Recipe Generator API running on http://localhost:${PORT}`);
        console.log(`   POST /api/analyze-image  — Send food photo for analysis`);
        console.log(`   POST /api/generate-recipe — Generate recipe by dish name`);
        console.log(`   GET  /api/health         — Health check\n`);
        console.log(`   OpenRouter key: ${process.env.OPENROUTER_API_KEY ? '✅ configured' : '❌ missing'}`);
        console.log(`   Gemini key:     ${process.env.GEMINI_API_KEY ? '✅ configured' : '❌ missing'}\n`);
    });
}

export default app;
