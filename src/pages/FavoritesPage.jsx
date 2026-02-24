import { Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import recipes from '../data/recipes';
import RecipeCard from '../components/RecipeCard';

export default function FavoritesPage({ favorites, toggleFavorite, ratings }) {
  const favoriteRecipes = recipes.filter(r => favorites.includes(r.id));

  // Smart suggestions based on user ratings AND favorite cuisines/dietary preferences
  const getSuggestions = () => {
    const ratedRecipes = recipes.filter(r => ratings[r.id] > 0);
    const favRecipes = [...favoriteRecipes, ...ratedRecipes];

    if (favRecipes.length === 0) return [];

    // Collect user preference signals
    const cuisineCounts = {};
    const dietaryCounts = {};
    const difficultyCounts = {};

    favRecipes.forEach(r => {
      const weight = ratings[r.id] || (favorites.includes(r.id) ? 3 : 1);
      cuisineCounts[r.cuisine] = (cuisineCounts[r.cuisine] || 0) + weight;
      r.dietary.forEach(d => {
        dietaryCounts[d] = (dietaryCounts[d] || 0) + weight;
      });
      difficultyCounts[r.difficulty] = (difficultyCounts[r.difficulty] || 0) + weight;
    });

    // Score every non-favorite, non-rated recipe
    const candidates = recipes
      .filter(r => !favorites.includes(r.id))
      .map(r => {
        let score = 0;
        score += (cuisineCounts[r.cuisine] || 0) * 3;
        r.dietary.forEach(d => {
          score += (dietaryCounts[d] || 0) * 2;
        });
        score += (difficultyCounts[r.difficulty] || 0);
        return { ...r, suggestionScore: score };
      })
      .filter(r => r.suggestionScore > 0)
      .sort((a, b) => b.suggestionScore - a.suggestionScore)
      .slice(0, 4);

    return candidates;
  };

  const suggestions = getSuggestions();

  return (
    <div className="favorites-page">
      <h1><Heart size={28} /> Your Favorites</h1>

      {favoriteRecipes.length > 0 ? (
        <div className="recipe-grid">
          {favoriteRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={{ ...recipe, rating: ratings[recipe.id] || 0 }}
              isFavorite={true}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="no-favorites">
          <Heart size={48} />
          <h3>No favorites yet</h3>
          <p>Start exploring recipes and save your favorites here.</p>
          <Link to="/search" className="btn btn-primary">Find Recipes</Link>
        </div>
      )}

      {suggestions.length > 0 && (
        <section className="section">
          <h2><Sparkles size={24} /> Recommended for You</h2>
          <p className="suggestion-hint">Based on your ratings and favorites</p>
          <div className="recipe-grid">
            {suggestions.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={{ ...recipe, rating: ratings[recipe.id] || 0 }}
                isFavorite={favorites.includes(recipe.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
