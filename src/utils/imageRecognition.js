/**
 * Ingredient recognition from images using Google Gemini API.
 * Uses the free-tier Gemini 2.0 Flash model for image analysis.
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Converts a File to a base64 string.
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Analyzes an image using Google Gemini API and returns detected ingredients.
 */
export async function analyzeImage(file, onStatus) {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Please upload a valid image file.');
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Add VITE_GEMINI_API_KEY to your .env file.');
  }

  if (onStatus) onStatus('Reading image...');

  const base64Image = await fileToBase64(file);

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `Look at this food image. List every individual ingredient you can identify or that would be used to make this dish.

Reply with ONLY a JSON array of strings in lowercase. Example: ["rice", "chicken", "onion", "garlic"]

Important rules:
- Break dishes into their individual ingredients (not dish names)
- Use simple common ingredient names
- Include spices, vegetables, proteins, grains, oils, etc.
- Return ONLY the JSON array, nothing else`
          },
          {
            inlineData: {
              mimeType: file.type,
              data: base64Image
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 1024
    }
  };

  // Retry up to 3 times for rate limits
  let lastError = null;
  for (let attempt = 1; attempt <= 4; attempt++) {
    if (onStatus) {
      onStatus(attempt === 1 ? 'Analyzing with AI...' : `Retrying... (attempt ${attempt}/4)`);
    }

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      // If rate limited, wait and retry
      if (response.status === 429) {
        console.warn(`[Gemini] Rate limited on attempt ${attempt}`);
        lastError = new Error('Rate limit reached. Please wait a minute and try again.');
        if (attempt < 4) {
          const delay = attempt * 5000;
          if (onStatus) onStatus(`Rate limited. Waiting ${attempt * 5}s...`);
          await wait(delay);
          continue;
        }
        throw lastError;
      }

      // Handle other HTTP errors
      if (!response.ok) {
        const errBody = await response.text();
        console.error(`[Gemini] HTTP ${response.status}:`, errBody);
        throw new Error(`Gemini API error (${response.status}): ${errBody.substring(0, 200)}`);
      }

      // Parse the successful response
      const data = await response.json();
      console.log('[Gemini] Response:', JSON.stringify(data, null, 2));

      // Check for safety blocks
      if (data.promptFeedback?.blockReason) {
        throw new Error(`Image blocked: ${data.promptFeedback.blockReason}`);
      }

      const candidate = data.candidates?.[0];
      if (!candidate) {
        console.error('[Gemini] No candidates:', data);
        throw new Error('AI returned no results. Try a different image.');
      }

      if (candidate.finishReason === 'SAFETY') {
        throw new Error('Image flagged by safety filter. Try a different photo.');
      }

      const text = candidate.content?.parts?.[0]?.text || '';
      console.log('[Gemini] AI said:', text);

      if (!text.trim()) {
        throw new Error('AI returned empty text. Try a clearer photo.');
      }

      // Parse ingredients from the response
      const ingredients = parseIngredients(text);

      if (ingredients.length === 0) {
        throw new Error(`No ingredients found. AI said: "${text.substring(0, 150)}"`);
      }

      return {
        ingredients,
        confidence: ingredients.length > 5 ? 'high' : ingredients.length > 2 ? 'medium' : 'low',
        message: `Detected ${ingredients.length} ingredient${ingredients.length !== 1 ? 's' : ''}: ${ingredients.join(', ')}`
      };

    } catch (err) {
      lastError = err;
      // Only retry on rate limit, not on other errors
      if (!err.message.includes('Rate limit') && !err.message.includes('429')) {
        throw err;
      }
    }
  }

  throw lastError || new Error('Failed to analyze image after multiple attempts.');
}

/**
 * Parse ingredients from AI response text, handling multiple formats.
 */
function parseIngredients(text) {
  // Strip markdown code fences if present
  let clean = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

  // Try parsing as JSON array directly
  try {
    const parsed = JSON.parse(clean);
    if (Array.isArray(parsed)) {
      return dedupe(parsed);
    }
  } catch { /* not valid JSON */ }

  // Try to find a JSON array anywhere in the text (greedy match for full array)
  const arrayMatch = clean.match(/\[([^\]]*)\]/);
  if (arrayMatch) {
    try {
      const parsed = JSON.parse(arrayMatch[0]);
      if (Array.isArray(parsed)) {
        return dedupe(parsed);
      }
    } catch { /* parse failed */ }

    // Try manually parsing the content between brackets
    const items = arrayMatch[1]
      .split(',')
      .map(s => s.replace(/["']/g, '').trim())
      .filter(s => s.length > 0);
    if (items.length > 0) {
      return dedupe(items);
    }
  }

  // Last resort: split by commas or newlines
  const items = clean
    .replace(/[\[\]"']/g, '')
    .split(/[,\n]+/)
    .map(s => s.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim())
    .filter(s => s.length > 1 && s.length < 50);

  return dedupe(items);
}

function dedupe(arr) {
  return [...new Set(
    arr
      .filter(i => typeof i === 'string')
      .map(i => i.toLowerCase().trim())
      .filter(i => i.length > 1 && i.length < 50)
  )];
}
