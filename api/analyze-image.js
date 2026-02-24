// Vercel Serverless Function: POST /api/analyze-image
// OpenRouter ONLY — tested and confirmed working free vision models

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const RECIPE_PROMPT = 'You are a professional chef. Analyze this food image.\n' +
    '1. Identify the dish\n2. List ingredients with quantities\n3. Give step-by-step cooking instructions\n4. Estimate nutrition per serving\n\n' +
    'Reply ONLY with valid JSON (no markdown, no code fences):\n' +
    '{"dishName":"Dish Name","cuisine":"Cuisine","ingredients":[{"name":"item","quantity":"amount"}],' +
    '"recipe":{"servings":4,"prepTime":"15 mins","cookTime":"30 mins","difficulty":"Medium","steps":["Step 1...","Step 2..."]},' +
    '"nutrition":{"calories":400,"protein":"25g","carbs":"50g","fat":"10g","fiber":"5g"}}';

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

    const { image, mimeType } = req.body || {};
    if (!image) return res.status(400).json({ error: 'No image data provided' });

    const orKey = (process.env.OPENROUTER_API_KEY || '').trim();
    if (!orKey) {
        return res.status(500).json({ error: 'OPENROUTER_API_KEY is not configured on server.' });
    }

    const dataUrl = 'data:' + (mimeType || 'image/jpeg') + ';base64,' + image;
    const errors = [];
    let aiText = null;

    // TESTED & CONFIRMED working free vision models on OpenRouter
    const models = [
        'google/gemma-3-27b-it:free',
        'google/gemma-3-12b-it:free'
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
                    messages: [{ role: 'user', content: [{ type: 'text', text: RECIPE_PROMPT }, { type: 'image_url', image_url: { url: dataUrl } }] }],
                    max_tokens: 2048,
                    temperature: 0.2
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
                        errors.push(model + ': empty response');
                    }
                } catch {
                    errors.push(model + ': invalid JSON');
                }
            } else {
                errors.push(model + ': HTTP ' + response.status + ' - ' + responseText.slice(0, 150));
            }
        } catch (err) {
            errors.push(model + ': ' + err.message);
        }
    }

    if (!aiText) {
        return res.status(502).json({ error: 'Could not get AI response.', details: errors });
    }

    const parsed = parseAIResponse(aiText);
    if (!parsed) return res.status(502).json({ error: 'Could not parse AI response.' });
    res.json(parsed);
}
