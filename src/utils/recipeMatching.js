/**
 * Normalizes an ingredient name for comparison.
 */
function normalize(str) {
  return str.toLowerCase().trim()
    .replace(/s$/, '')
    .replace(/es$/, '')
    .replace(/ies$/, 'y');
}

/**
 * Checks if a user ingredient matches a recipe ingredient.
 */
function ingredientMatches(userIngredient, recipeIngredient) {
  const u = normalize(userIngredient);
  const r = normalize(recipeIngredient);
  return r.includes(u) || u.includes(r);
}

/**
 * Scores how well a recipe matches the given ingredients.
 * Returns a value between 0 and 1.
 */
export function scoreRecipe(recipe, userIngredients) {
  if (!userIngredients.length) return 0;
  const matched = recipe.ingredients.filter(ri =>
    userIngredients.some(ui => ingredientMatches(ui, ri.name))
  );
  return matched.length / recipe.ingredients.length;
}

/**
 * Finds recipes matching given ingredients and filters.
 */
export function findRecipes(recipes, userIngredients, filters = {}) {
  let results = recipes.map(recipe => ({
    ...recipe,
    matchScore: scoreRecipe(recipe, userIngredients),
    matchedIngredients: recipe.ingredients.filter(ri =>
      userIngredients.some(ui => ingredientMatches(ui, ri.name))
    ).map(i => i.name),
    missingIngredients: recipe.ingredients.filter(ri =>
      !userIngredients.some(ui => ingredientMatches(ui, ri.name))
    ).map(i => i.name)
  }));

  // Only include recipes with at least some match
  if (userIngredients.length > 0) {
    results = results.filter(r => r.matchScore > 0);
  } else {
    results = results.map(r => ({ ...r, matchScore: 1 }));
  }

  // Apply filters
  if (filters.dietary && filters.dietary.length > 0) {
    results = results.filter(r =>
      filters.dietary.every(d => r.dietary.includes(d))
    );
  }

  if (filters.difficulty) {
    results = results.filter(r => r.difficulty === filters.difficulty);
  }

  if (filters.maxCookingTime) {
    results = results.filter(r => r.cookingTime <= filters.maxCookingTime);
  }

  if (filters.cuisine) {
    results = results.filter(r => r.cuisine === filters.cuisine);
  }

  // Sort by match score descending
  results.sort((a, b) => b.matchScore - a.matchScore);

  return results;
}

/**
 * Gets substitution suggestions for missing ingredients.
 */
const substitutions = {
  "butter": ["margarine", "coconut oil", "olive oil"],
  "milk": ["almond milk", "oat milk", "coconut milk", "soy milk"],
  "egg": ["flax egg", "chia egg", "applesauce", "banana"],
  "cream": ["coconut cream", "cashew cream", "yogurt"],
  "flour": ["almond flour", "coconut flour", "oat flour"],
  "sugar": ["honey", "maple syrup", "stevia"],
  "soy sauce": ["coconut aminos", "tamari", "fish sauce"],
  "chicken breast": ["tofu", "turkey breast", "tempeh"],
  "chicken thigh": ["tofu", "turkey thigh", "tempeh"],
  "ground beef": ["ground turkey", "ground chicken", "lentils", "mushroom"],
  "beef sirloin": ["chicken breast", "tofu", "portobello mushroom"],
  "ground lamb": ["ground beef", "ground turkey", "lentils"],
  "shrimp": ["tofu", "chicken", "tempeh"],
  "cod fillet": ["tilapia", "haddock", "tofu"],
  "salmon fillet": ["trout", "tuna", "tofu"],
  "bacon": ["turkey bacon", "tempeh bacon", "mushroom"],
  "parmesan cheese": ["nutritional yeast", "pecorino", "asiago"],
  "mozzarella cheese": ["provolone", "gouda", "vegan mozzarella"],
  "yogurt": ["coconut yogurt", "sour cream"],
  "rice": ["quinoa", "cauliflower rice", "couscous"],
  "pasta": ["zucchini noodles", "rice noodles", "spaghetti squash"],
  "bread": ["tortilla", "rice cake", "lettuce wrap"],
  "tortilla": ["pita bread", "lettuce leaf", "naan"],
  "peanuts": ["cashews", "almonds", "sunflower seeds"],
  "coconut milk": ["almond milk", "cream", "cashew milk"]
};

export function getSubstitutions(ingredientName) {
  const key = normalize(ingredientName);
  for (const [ingredient, subs] of Object.entries(substitutions)) {
    if (normalize(ingredient) === key || key.includes(normalize(ingredient))) {
      return subs;
    }
  }
  return [];
}

/**
 * Adjusts recipe quantities based on serving size.
 */
export function adjustServings(recipe, newServings) {
  const ratio = newServings / recipe.servings;
  return {
    ...recipe,
    servings: newServings,
    ingredients: recipe.ingredients.map(i => {
      // Parse fraction strings like "1/2" or "1/4"
      const parseFraction = (str) => {
        if (str.includes('/')) {
          const [num, den] = str.split('/').map(Number);
          return num / den;
        }
        return parseFloat(str);
      };
      const numericAmount = parseFraction(i.amount) * ratio;
      const formatted = numericAmount % 1 === 0
        ? numericAmount.toString()
        : numericAmount.toFixed(1);
      return { ...i, amount: formatted };
    }),
    nutrition: {
      calories: Math.round(recipe.nutrition.calories * ratio),
      protein: Math.round(recipe.nutrition.protein * ratio),
      carbs: Math.round(recipe.nutrition.carbs * ratio),
      fat: Math.round(recipe.nutrition.fat * ratio),
      fiber: Math.round(recipe.nutrition.fiber * ratio)
    }
  };
}
