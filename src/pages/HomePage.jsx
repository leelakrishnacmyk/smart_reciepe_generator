import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Camera, ChefHat, Star, Filter, Heart } from 'lucide-react';
import recipes from '../data/recipes';
import RecipeCard from '../components/RecipeCard';

export default function HomePage({ favorites, toggleFavorite, ratings }) {
  const [featured] = useState(() => {
    const shuffled = [...recipes].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  });

  // Get top-rated recipes based on user ratings
  const topRated = recipes
    .filter(r => ratings[r.id] > 0)
    .sort((a, b) => (ratings[b.id] || 0) - (ratings[a.id] || 0))
    .slice(0, 4);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Smart Recipe Generator</h1>
          <p>Discover delicious recipes based on ingredients you already have. Upload a photo or type your ingredients to get started.</p>
          <div className="hero-actions">
            <Link to="/search" className="btn btn-primary">
              <Search size={20} />
              Find Recipes
            </Link>
          </div>
        </div>
        <div className="hero-features">
          <div className="feature-card">
            <Camera size={32} />
            <h3>Photo Recognition</h3>
            <p>Upload a photo of your ingredients</p>
          </div>
          <div className="feature-card">
            <Filter size={32} />
            <h3>Smart Filters</h3>
            <p>Filter by diet, time, and difficulty</p>
          </div>
          <div className="feature-card">
            <ChefHat size={32} />
            <h3>25+ Recipes</h3>
            <p>Diverse cuisines with full details</p>
          </div>
          <div className="feature-card">
            <Heart size={32} />
            <h3>Save Favorites</h3>
            <p>Rate and save recipes you love</p>
          </div>
        </div>
      </section>

      {topRated.length > 0 && (
        <section className="section">
          <h2><Star size={24} /> Your Top Rated</h2>
          <div className="recipe-grid">
            {topRated.map(recipe => (
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

      <section className="section">
        <h2><ChefHat size={24} /> Featured Recipes</h2>
        <div className="recipe-grid">
          {featured.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={{ ...recipe, rating: ratings[recipe.id] || 0 }}
              isFavorite={favorites.includes(recipe.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
