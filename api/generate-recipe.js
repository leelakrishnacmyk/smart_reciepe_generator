// Vercel Serverless Function: POST /api/generate-recipe
// OpenRouter ONLY

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

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
    return { dishName: 'Recipe', cuisine: '', ingredients: [], recipe: { steps: [text] }, nutrition: {} };
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
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { dishName } = req.body || {};
    if (!dishName || !dishName.trim()) return res.status(400).json({ error: 'No dish name provided' });

    const prompt = buildPrompt(dishName.trim());
    const orKey = (process.env.OPENROUTER_API_KEY || '').trim();

    if (!orKey) {
        return res.status(500).json({ error: 'OPENROUTER_API_KEY is not configured on server.' });
    }

    const errors = [];
    let aiText = null;

    // Current confirmed free models on OpenRouter (Feb 2026)
    const models = [
        'meta-llama/llama-4-maverick:free',
        'meta-llama/llama-4-scout:free',
        'deepseek/deepseek-chat-v3-0324:free',
        'mistralai/mistral-small-3.1-24b-instruct:free',
        'nousresearch/deephermes-3-llama-3-8b-preview:free'
    ];

    for (const model of models) {
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

            const responseText = await response.text();

            if (response.ok) {
                try {
                    const data = JSON.parse(responseText);
                    const text = data.choices?.[0]?.message?.content || '';
                    if (text.trim()) {
                        aiText = text;
                    } else {
                        errors.push(model + ': empty response body');
                    }
                } catch {
                    errors.push(model + ': invalid JSON in response');
                }
            } else {
                errors.push(model + ': HTTP ' + response.status + ' - ' + responseText.slice(0, 200));
            }
        } catch (err) {
            errors.push(model + ': fetch error - ' + err.message);
        }
    }

    if (!aiText) {
        return res.status(502).json({
            error: 'Could not get AI response.',
            details: errors,
            keyInfo: {
                prefix: orKey.substring(0, 12) + '...',
                length: orKey.length,
                startsWithSkOr: orKey.startsWith('sk-or-')
            }
        });
    }

    const parsed = parseAIResponse(aiText);
    res.json(parsed);
}
