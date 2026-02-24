import { useState, useMemo } from 'react';
import { Search, ChefHat } from 'lucide-react';
import recipes from '../data/recipes';
import IngredientInput from '../components/IngredientInput';
import FilterBar from '../components/FilterBar';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';
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

  const results = useMemo(() => {
    if (!hasSearched && ingredients.length === 0) return [];
    return findRecipes(recipes, ingredients, filters);
  }, [ingredients, filters, hasSearched]);

  const handleSearch = () => {
    setIsSearching(true);
    setHasSearched(true);
    // Simulate a brief loading state for UX
    setTimeout(() => setIsSearching(false), 500);
  };

  // Auto-search when ingredients change
  const handleIngredientsChange = (newIngredients) => {
    setIngredients(newIngredients);
    if (newIngredients.length > 0) {
      setHasSearched(true);
      setIsSearching(true);
      setTimeout(() => setIsSearching(false), 300);
    }
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1><Search size={28} /> Find Recipes</h1>
        <p>Enter the ingredients you have, and we'll find the best matching recipes.</p>
      </div>

      <IngredientInput
        ingredients={ingredients}
        setIngredients={handleIngredientsChange}
      />

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
          <p>Type ingredient names or upload a photo of your ingredients to find matching recipes.</p>
        </div>
      )}
    </div>
  );
}
