import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, ChefHat, Users, Heart, Minus, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import recipes from '../data/recipes';
import StarRating from '../components/StarRating';
import { adjustServings, getSubstitutions } from '../utils/recipeMatching';

export default function RecipeDetailPage({ favorites, toggleFavorite, ratings, onRate }) {
  const { id } = useParams();
  const recipe = recipes.find(r => r.id === parseInt(id));
  const [servings, setServings] = useState(recipe?.servings || 4);
  const [showSubstitutions, setShowSubstitutions] = useState({});

  const adjusted = useMemo(() => {
    if (!recipe) return null;
    return adjustServings(recipe, servings);
  }, [recipe, servings]);

  if (!recipe) {
    return (
      <div className="error-page">
        <AlertCircle size={48} />
        <h2>Recipe not found</h2>
        <p>The recipe you're looking for doesn't exist.</p>
        <Link to="/search" className="btn btn-primary">Back to Search</Link>
      </div>
    );
  }

  const isFavorite = favorites.includes(recipe.id);
  const userRating = ratings[recipe.id] || 0;

  const toggleSubstitution = (ingredientName) => {
    setShowSubstitutions(prev => ({
      ...prev,
      [ingredientName]: !prev[ingredientName]
    }));
  };

  return (
    <div className="recipe-detail-page">
      <Link to="/search" className="back-link">
        <ArrowLeft size={20} /> Back to recipes
      </Link>

      <div className="recipe-detail-header">
        <div className="recipe-detail-image">
          <img
            src={recipe.image}
            alt={recipe.name}
            onError={(e) => {
              e.target.src = `https://placehold.co/600x400/f0f0f0/999?text=${encodeURIComponent(recipe.name)}`;
            }}
          />
        </div>
        <div className="recipe-detail-info">
          <div className="recipe-detail-tags">
            <span className="cuisine-tag">{recipe.cuisine}</span>
            {recipe.dietary.map(d => (
              <span key={d} className="dietary-tag">{d}</span>
            ))}
          </div>
          <h1>{recipe.name}</h1>
          <div className="recipe-detail-meta">
            <span><Clock size={18} /> {recipe.cookingTime} min</span>
            <span><ChefHat size={18} /> {recipe.difficulty}</span>
            <span><Users size={18} /> {adjusted.servings} servings</span>
          </div>

          <div className="serving-adjuster">
            <label>Servings:</label>
            <button
              onClick={() => setServings(Math.max(1, servings - 1))}
              disabled={servings <= 1}
            >
              <Minus size={16} />
            </button>
            <span className="serving-count">{servings}</span>
            <button onClick={() => setServings(servings + 1)}>
              <Plus size={16} />
            </button>
          </div>

          <div className="recipe-actions">
            <button
              className={`btn ${isFavorite ? 'btn-favorite-active' : 'btn-favorite'}`}
              onClick={() => toggleFavorite(recipe.id)}
            >
              <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
              {isFavorite ? 'Saved' : 'Save Recipe'}
            </button>
          </div>

          <div className="rating-section">
            <h3>Rate this recipe</h3>
            <StarRating rating={userRating} onRate={(stars) => onRate(recipe.id, stars)} />
          </div>
        </div>
      </div>

      <div className="recipe-detail-content">
        <div className="nutrition-card">
          <h2>Nutrition (per serving)</h2>
          <div className="nutrition-grid">
            <div className="nutrition-item">
              <span className="nutrition-value">{adjusted.nutrition.calories}</span>
              <span className="nutrition-label">Calories</span>
            </div>
            <div className="nutrition-item">
              <span className="nutrition-value">{adjusted.nutrition.protein}g</span>
              <span className="nutrition-label">Protein</span>
            </div>
            <div className="nutrition-item">
              <span className="nutrition-value">{adjusted.nutrition.carbs}g</span>
              <span className="nutrition-label">Carbs</span>
            </div>
            <div className="nutrition-item">
              <span className="nutrition-value">{adjusted.nutrition.fat}g</span>
              <span className="nutrition-label">Fat</span>
            </div>
            <div className="nutrition-item">
              <span className="nutrition-value">{adjusted.nutrition.fiber}g</span>
              <span className="nutrition-label">Fiber</span>
            </div>
          </div>
        </div>

        <div className="ingredients-section">
          <h2>Ingredients</h2>
          <ul className="ingredients-list">
            {adjusted.ingredients.map((ing, idx) => {
              const subs = getSubstitutions(ing.name);
              return (
                <li key={idx}>
                  <span className="ingredient-amount">{ing.amount} {ing.unit}</span>
                  <span className="ingredient-name">{ing.name}</span>
                  {subs.length > 0 && (
                    <button
                      className="sub-toggle"
                      onClick={() => toggleSubstitution(ing.name)}
                      title="View substitutions"
                    >
                      <RefreshCw size={14} />
                    </button>
                  )}
                  {showSubstitutions[ing.name] && subs.length > 0 && (
                    <div className="substitution-list">
                      Substitutes: {subs.join(', ')}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="steps-section">
          <h2>Instructions</h2>
          <ol className="steps-list">
            {recipe.steps.map((step, idx) => (
              <li key={idx}>
                <span className="step-number">{idx + 1}</span>
                <span className="step-text">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
