// Vercel Serverless Function: POST /api/generate-recipe
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const GEMINI_FLASH = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_FLASH_15 = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

function buildPrompt(dishName) {
    return 'You are a professional chef. The user wants to cook "' + dishName + '".\n\n' +
        'Give a complete recipe with:\n1. Ingredients with exact quantities\n2. Step-by-step cooking instructions\n3. Nutritional info per serving\n\n' +
        'Reply ONLY with valid JSON (no markdown, no code fences):\n' +
        '{"dishName":"' + dishName + '","cuisine":"specify cuisine","ingredients":[{"name":"item","quantity":"amount"}],' +
        '"recipe":{"servings":4,"prepTime":"15 mins","cookTime":"30 mins","difficulty":"Medium","steps":["Step 1...","Step 2..."]},' +
        '"nutrition":{"calories":400,"protein":"25g","carbs":"50g","fat":"10g","fiber":"5g"}}';
}

function parseAIResponse(text) {
    if (!text) return null;
    let clean = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    try { const p = JSON.parse(clean); if (p.dishName) return normalizeRecipe(p); } catch { }
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) { try { const p = JSON.parse(match[0]); if (p.dishName) return normalizeRecipe(p); } catch { } }
    return { dishName: 'Recipe', cuisine: '', ingredients: [], recipe: { servings: 4, prepTime: '', cookTime: '', difficulty: 'Medium', steps: [text] }, nutrition: {} };
}

function normalizeRecipe(p) {
    return {
        dishName: p.dishName || 'Unknown',
        cuisine: p.cuisine || '',
        ingredients: (p.ingredients || []).map(i => typeof i === 'string' ? { name: i, quantity: '' } : { name: i.name || '', quantity: i.quantity || '' }),
        recipe: { servings: p.recipe?.servings || 4, prepTime: p.recipe?.prepTime || '', cookTime: p.recipe?.cookTime || '', difficulty: p.recipe?.difficulty || 'Medium', steps: p.recipe?.steps || [] },
        nutrition: p.nutrition || {}
    };
}

async function callGemini(url, gemKey, prompt) {
    const response = await fetch(url + '?key=' + gemKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 2048 }
        })
    });
    if (!response.ok) {
        const errBody = await response.text().catch(() => '');
        throw new Error('Gemini ' + response.status + ': ' + errBody.slice(0, 200));
    }
    const data = await response.json();
    const candidate = data.candidates?.[0];
    if (!candidate || candidate.finishReason === 'SAFETY') throw new Error('Gemini safety block');
    return candidate.content?.parts?.[0]?.text || '';
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { dishName } = req.body || {};
    if (!dishName || !dishName.trim()) return res.status(400).json({ error: 'No dish name provided' });

    const prompt = buildPrompt(dishName.trim());
    const errors = [];
    let aiText = null;

    const gemKey = process.env.GEMINI_API_KEY;
    const orKey = process.env.OPENROUTER_API_KEY;

    // 1. Try Gemini 2.0 Flash
    if (gemKey) {
        try {
            aiText = await callGemini(GEMINI_FLASH, gemKey, prompt);
        } catch (err) {
            errors.push('Gemini 2.0: ' + err.message);
        }
    } else {
        errors.push('Gemini: GEMINI_API_KEY not set');
    }

    // 2. Try Gemini 1.5 Flash
    if (!aiText && gemKey) {
        try {
            aiText = await callGemini(GEMINI_FLASH_15, gemKey, prompt);
        } catch (err) {
            errors.push('Gemini 1.5: ' + err.message);
        }
    }

    // 3. Try OpenRouter with valid free models
    if (!aiText && orKey) {
        const models = [
            'mistralai/mistral-7b-instruct:free',
            'google/gemma-3-12b-it:free',
            'meta-llama/llama-3.2-3b-instruct:free'
        ];
        for (const model of models) {
            if (aiText) break;
            try {
                const response = await fetch(OPENROUTER_URL, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + orKey,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://smart-reciepe-generator-rqpo.vercel.app',
                        'X-Title': 'Smart Recipe Generator'
                    },
                    body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], max_tokens: 2048, temperature: 0.3 })
                });
                if (response.ok) {
                    const data = await response.json();
                    aiText = data.choices?.[0]?.message?.content || '';
                } else {
                    const errBody = await response.text().catch(() => '');
                    errors.push('OpenRouter ' + model + ': ' + response.status + ' ' + errBody.slice(0, 100));
                }
            } catch (err) {
                errors.push('OpenRouter ' + model + ': ' + err.message);
            }
        }
    } else if (!aiText) {
        errors.push('OpenRouter: OPENROUTER_API_KEY not set');
    }

    if (!aiText) {
        return res.status(502).json({
            error: 'Could not get AI response. Check API keys.',
            details: errors
        });
    }

    const parsed = parseAIResponse(aiText);
    res.json(parsed);
}
