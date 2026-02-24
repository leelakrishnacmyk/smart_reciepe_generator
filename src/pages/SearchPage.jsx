import { ChefHat, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import AIRecipeResult from '../components/AIRecipeResult';
import FilterBar from '../components/FilterBar';
import IngredientInput from '../components/IngredientInput';
import LoadingSpinner from '../components/LoadingSpinner';
import RecipeCard from '../components/RecipeCard';
import recipes from '../data/recipes';
import { findRecipes } from '../utils/recipeMatching';

export default function SearchPage({ favorites, toggleFavorite, ratings }) {
  const [ingredients, setIngredients] = useState([]);
  const [filters, setFilters] = useState({
    dietary: [],
    difficulty: '',
    maxCookingTime: 0,
    cuisine: ''
  });
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [aiRecipe, setAiRecipe] = useState(null);

  const results = useMemo(() => {
    if (!hasSearched && ingredients.length === 0) return [];
    return findRecipes(recipes, ingredients, filters);
  }, [ingredients, filters, hasSearched]);

  const handleSearch = () => {
    setIsSearching(true);
    setHasSearched(true);
    setTimeout(() => setIsSearching(false), 500);
  };

  const handleIngredientsChange = (newIngredients) => {
    setIngredients(newIngredients);
    if (newIngredients.length > 0) {
      setHasSearched(true);
      setIsSearching(true);
      setTimeout(() => setIsSearching(false), 300);
    }
  };

  const handleAIRecipe = (result) => {
    setAiRecipe(result);
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1><Search size={28} /> Find Recipes</h1>
        <p>Enter the ingredients you have, or upload a photo of your dish to get the full recipe.</p>
      </div>

      <IngredientInput
        ingredients={ingredients}
        setIngredients={handleIngredientsChange}
        onAIRecipe={handleAIRecipe}
      />

      {/* AI-Generated Recipe from Image */}
      {aiRecipe && (
        <AIRecipeResult
          result={aiRecipe}
          onClose={() => setAiRecipe(null)}
        />
      )}

      <FilterBar filters={filters} setFilters={setFilters} />

      {ingredients.length > 0 && !isSearching && (
        <button className="btn btn-primary search-btn" onClick={handleSearch}>
          <ChefHat size={20} />
          Find {results.length} Recipe{results.length !== 1 ? 's' : ''}
        </button>
      )}

      {isSearching ? (
        <LoadingSpinner />
      ) : hasSearched ? (
        <div className="search-results">
          <h2>{results.length} Recipe{results.length !== 1 ? 's' : ''} Found</h2>
          {results.length > 0 ? (
            <div className="recipe-grid">
              {results.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={{ ...recipe, rating: ratings[recipe.id] || 0 }}
                  isFavorite={favorites.includes(recipe.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <ChefHat size={48} />
              <h3>No recipes found</h3>
              <p>Try adding more ingredients or adjusting your filters.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="search-empty">
          <ChefHat size={64} />
          <h3>Start by adding ingredients</h3>
          <p>Type ingredient names or upload a photo of your dish to get the full recipe.</p>
        </div>
      )}
    </div>
  );
}
