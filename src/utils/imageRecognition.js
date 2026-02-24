/**
 * Image recognition - calls backend API (POST /api/analyze-image).
 * The backend handles the OpenRouter/Gemini API calls server-side.
 */

function fileToBase64Raw(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Strip the data URL prefix to get raw base64
      const result = reader.result;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Main entry: analyze image by sending it to backend POST /api/analyze-image.
 * Returns { dishName, cuisine, ingredients, recipe, nutrition }
 */
export async function analyzeImage(file, onStatus) {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Please upload a valid image file.');
  }

  if (onStatus) onStatus('Reading image...');
  const base64 = await fileToBase64Raw(file);

  if (onStatus) onStatus('Sending to AI for analysis...');

  const response = await fetch('/api/analyze-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: base64,
      mimeType: file.type
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Server error (${response.status})`);
  }

  const data = await response.json();
  console.log('[API] Recipe response:', data);

  // Extract simple ingredient names for the ingredient tags
  const ingredientNames = (data.ingredients || []).map(i =>
    typeof i === 'string' ? i.toLowerCase() : (i.name || '').toLowerCase()
  ).filter(Boolean);

  return {
    dishName: data.dishName || 'Unknown Dish',
    cuisine: data.cuisine || '',
    ingredients: ingredientNames,
    fullIngredients: data.ingredients || [],
    recipe: data.recipe || { steps: [] },
    nutrition: data.nutrition || {},
    confidence: ingredientNames.length > 5 ? 'high' : ingredientNames.length > 2 ? 'medium' : 'low',
    message: `Identified: ${data.dishName || 'a dish'} (${ingredientNames.length} ingredients detected)`
  };
}
