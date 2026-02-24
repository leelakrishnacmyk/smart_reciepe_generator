// Vercel Serverless Function: POST /api/analyze-image
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const RECIPE_PROMPT = 'You are a professional chef. Analyze this food image.\n' +
    '1. Identify the dish\n2. List ingredients with quantities\n3. Give step-by-step cooking instructions\n4. Estimate nutrition per serving\n\n' +
    'Reply with ONLY valid JSON, no markdown:\n' +
    '{"dishName":"Dish Name","cuisine":"Cuisine Type","ingredients":[{"name":"ingredient","quantity":"amount"}],' +
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

    let aiText = null;

    // --- Try Gemini first (supports vision natively) ---
    const gemKey = process.env.GEMINI_API_KEY;
    if (gemKey) {
        try {
            const response = await fetch(GEMINI_URL + '?key=' + gemKey, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: RECIPE_PROMPT }, { inlineData: { mimeType: mimeType || 'image/jpeg', data: image } }] }],
                    generationConfig: { temperature: 0.2, maxOutputTokens: 2048 }
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

    // --- Fallback: OpenRouter with vision-capable free models ---
    if (!aiText) {
        const orKey = process.env.OPENROUTER_API_KEY;
        if (orKey) {
            const dataUrl = 'data:' + (mimeType || 'image/jpeg') + ';base64,' + image;
            const visionModels = [
                'google/gemma-3-27b-it:free',
                'meta-llama/llama-3.2-11b-vision-instruct:free'
            ];
            for (const model of visionModels) {
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
