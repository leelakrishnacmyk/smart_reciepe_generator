import { Link } from 'react-router-dom';
import { Clock, ChefHat, Users, Heart, Star } from 'lucide-react';

export default function RecipeCard({ recipe, isFavorite, onToggleFavorite }) {
  const matchPercent = recipe.matchScore != null
    ? Math.round(recipe.matchScore * 100)
    : null;

  return (
    <div className="recipe-card">
      <div className="recipe-card-image">
        <img
          src={recipe.image}
          alt={recipe.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://placehold.co/400x250/f0f0f0/999?text=${encodeURIComponent(recipe.name)}`;
          }}
        />
        {matchPercent != null && matchPercent > 0 && (
          <span className={`match-badge ${matchPercent >= 75 ? 'high' : matchPercent >= 50 ? 'medium' : 'low'}`}>
            {matchPercent}% match
          </span>
        )}
        <button
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); onToggleFavorite(recipe.id); }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <Link to={`/recipe/${recipe.id}`} className="recipe-card-body">
        <div className="recipe-card-tags">
          <span className="cuisine-tag">{recipe.cuisine}</span>
          {recipe.dietary.map(d => (
            <span key={d} className="dietary-tag">{d}</span>
          ))}
        </div>
        <h3>{recipe.name}</h3>
        <div className="recipe-card-meta">
          <span><Clock size={14} /> {recipe.cookingTime} min</span>
          <span><ChefHat size={14} /> {recipe.difficulty}</span>
          <span><Users size={14} /> {recipe.servings} servings</span>
          {recipe.rating > 0 && (
            <span><Star size={14} fill="gold" stroke="gold" /> {recipe.rating.toFixed(1)}</span>
          )}
        </div>
        <div className="recipe-card-nutrition">
          <span>{recipe.nutrition.calories} cal</span>
          <span>{recipe.nutrition.protein}g protein</span>
          <span>{recipe.nutrition.carbs}g carbs</span>
          <span>{recipe.nutrition.fat}g fat</span>
        </div>
        {recipe.matchedIngredients && recipe.matchedIngredients.length > 0 && (
          <div className="matched-ingredients">
            <small>You have: {recipe.matchedIngredients.join(', ')}</small>
          </div>
        )}
        {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
          <div className="missing-ingredients">
            <small>Missing: {recipe.missingIngredients.join(', ')}</small>
          </div>
        )}
      </Link>
    </div>
  );
}
