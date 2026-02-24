// Vercel Serverless Function: POST /api/generate-recipe
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function buildPrompt(dishName) {
    return 'You are a professional chef. The user wants to cook "' + dishName + '".\n\n' +
        '1. List all ingredients with exact quantities\n2. Provide detailed step-by-step cooking instructions\n3. Estimate nutritional information per serving\n\n' +
        'Reply with ONLY valid JSON, no markdown:\n' +
        '{"dishName":"' + dishName + '","cuisine":"specify cuisine","ingredients":[{"name":"ingredient","quantity":"amount"}],' +
        '"recipe":{"servings":4,"prepTime":"15 mins","cookTime":"30 mins","difficulty":"Medium","steps":["Step 1...","Step 2..."]},' +
        '"nutrition":{"calories":400,"protein":"25g","carbs":"50g","fat":"10g","fiber":"5g"}}';
}

function parseAIResponse(text) {
    if (!text) return null;
    let clean = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    try { const p = JSON.parse(clean); if (p.dishName) return normalizeRecipe(p); } catch { }
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) { try { const p = JSON.parse(match[0]); if (p.dishName) return normalizeRecipe(p); } catch { } }
    return null;
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

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { dishName } = req.body || {};
    if (!dishName || !dishName.trim()) return res.status(400).json({ error: 'No dish name provided' });

    const prompt = buildPrompt(dishName.trim());
    let aiText = null;

    // --- Try Gemini first (most reliable with existing key) ---
    const gemKey = process.env.GEMINI_API_KEY;
    if (gemKey) {
        try {
            const response = await fetch(GEMINI_URL + '?key=' + gemKey, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.3, maxOutputTokens: 2048 }
                })
            });
            if (response.ok) {
                const data = await response.json();
                const candidate = data.candidates?.[0];
                if (candidate && candidate.finishReason !== 'SAFETY') {
                    aiText = candidate.content?.parts?.[0]?.text || '';
                }
            } else {
                const errBody = await response.text().catch(() => '');
                console.error('[Gemini] Error:', response.status, errBody);
            }
        } catch (err) {
            console.error('[Gemini] Fetch error:', err.message);
        }
    }

    // --- Fallback: OpenRouter (free models) ---
    if (!aiText) {
        const orKey = process.env.OPENROUTER_API_KEY;
        if (orKey) {
            const freeModels = [
                'mistralai/mistral-7b-instruct:free',
                'google/gemma-3-12b-it:free',
                'meta-llama/llama-3.2-3b-instruct:free'
            ];
            for (const model of freeModels) {
                if (aiText) break;
                try {
                    const response = await fetch(OPENROUTER_URL, {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + orKey,
                            'Content-Type': 'application/json',
                            'HTTP-Referer': 'https://smart-reciepe-generator.vercel.app',
                            'X-Title': 'Smart Recipe Generator'
                        },
                        body: JSON.stringify({
                            model: model,
                            messages: [{ role: 'user', content: prompt }],
                            max_tokens: 2048,
                            temperature: 0.3
                        })
                    });
                    if (response.ok) {
                        const data = await response.json();
                        aiText = data.choices?.[0]?.message?.content || '';
                    } else {
                        console.error('[OpenRouter] Error with model ' + model + ':', response.status);
                    }
                } catch (err) {
                    console.error('[OpenRouter] Fetch error:', err.message);
                }
            }
        }
    }

    if (!aiText) return res.status(502).json({ error: 'Could not get AI response. Check API keys.' });
    const parsed = parseAIResponse(aiText);
    if (!parsed) return res.status(502).json({ error: 'Could not parse AI response.' });
    res.json(parsed);
}
