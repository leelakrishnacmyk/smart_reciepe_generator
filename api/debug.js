// Debug endpoint: GET /api/debug
export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({
        hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
        openRouterKeyPrefix: process.env.OPENROUTER_API_KEY ? process.env.OPENROUTER_API_KEY.substring(0, 10) + '...' : 'NOT SET',
        nodeEnv: process.env.NODE_ENV || 'not set',
        timestamp: new Date().toISOString()
    });
}
