// Vercel Serverless Function: POST /api/analyze-image
// Accepts { image (base64), mimeType } and returns AI-analyzed recipe from food image.

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const RECIPE_PROMPT = 'You are a professional chef. Look at this food image carefully.\n\n' +
    '1. Identify the dish name\n2. List all ingredients with quantities\n3. Provide step-by-step cooking instructions\n4. Estimate nutritional information per serving\n\n' +
    'Reply with ONLY valid JSON in this exact format (no markdown, no code fences):\n' +
    '{"dishName":"Name of the dish","cuisine":"Italian/Indian/Chinese/etc","ingredients":[{"name":"ingredient name","quantity":"amount with unit"}],' +
    '"recipe":{"servings":4,"prepTime":"15 mins","cookTime":"30 mins","difficulty":"Easy/Medium/Hard","steps":["Step 1","Step 2"]},' +
    '"nutrition":{"calories":450,"protein":"28g","carbs":"55g","fat":"12g","fiber":"4g"}}';

function parseAIResponse(text) {
    if (!text) return { dishName: 'Unknown', ingredients: [], recipe: { steps: [] }, nutrition: {} };
    let clean = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    try { const p = JSON.parse(clean); if (p.dishName) return normalizeRecipe(p); } catch { }
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) { try { const p = JSON.parse(match[0]); if (p.dishName) return normalizeRecipe(p); } catch { } }
    return { dishName: 'Detected Dish', ingredients: [], recipe: { steps: [clean] }, nutrition: {} };
}

function normalizeRecipe(p) {
    return {
        dishName: p.dishName || 'Unknown',
        cuisine: p.cuisine || '',
        ingredients: (p.ingredients || []).map(i => typeof i === 'string' ? { name: i, quantity: '' } : { name: i.name || i, quantity: i.quantity || '' }),
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

    // Try OpenRouter
    const orKey = process.env.OPENROUTER_API_KEY;
    if (orKey) {
        try {
            const dataUrl = 'data:' + (mimeType || 'image/jpeg') + ';base64,' + image;
            const response = await fetch(OPENROUTER_URL, {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + orKey, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://smart-reciepe-generator.vercel.app', 'X-Title': 'Smart Recipe Generator' },
                body: JSON.stringify({ model: 'openrouter/free', messages: [{ role: 'user', content: [{ type: 'text', text: RECIPE_PROMPT }, { type: 'image_url', image_url: { url: dataUrl } }] }], max_tokens: 2048, temperature: 0.2 })
            });
            if (response.ok) { const data = await response.json(); aiText = data.choices?.[0]?.message?.content || ''; }
            else { console.error('[OpenRouter] Error:', response.status); }
        } catch (err) { console.error('[OpenRouter] Fetch error:', err.message); }
    }

    // Fallback to Gemini
    if (!aiText) {
        const gemKey = process.env.GEMINI_API_KEY;
        if (gemKey) {
            try {
                const response = await fetch(GEMINI_URL + '?key=' + gemKey, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: RECIPE_PROMPT }, { inlineData: { mimeType: mimeType || 'image/jpeg', data: image } }] }], generationConfig: { temperature: 0.2, maxOutputTokens: 2048 } })
                });
                if (response.ok) {
                    const data = await response.json();
                    const candidate = data.candidates?.[0];
                    if (candidate && candidate.finishReason !== 'SAFETY') aiText = candidate.content?.parts?.[0]?.text || '';
                } else { console.error('[Gemini] Error:', response.status); }
            } catch (err) { console.error('[Gemini] Fetch error:', err.message); }
        }
    }

    if (!aiText) return res.status(502).json({ error: 'Could not get AI response. Check API keys.' });
    res.json(parseAIResponse(aiText));
}
