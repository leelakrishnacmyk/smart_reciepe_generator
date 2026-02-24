// Debug endpoint: GET /api/debug
// Returns env var status (masked) - helps diagnose deployment issues
export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({
        hasGeminiKey: !!process.env.GEMINI_API_KEY,
        geminiKeyPrefix: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 8) + '...' : 'NOT SET',
        hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
        openRouterKeyPrefix: process.env.OPENROUTER_API_KEY ? process.env.OPENROUTER_API_KEY.substring(0, 10) + '...' : 'NOT SET',
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
}
