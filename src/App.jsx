import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [favorites, setFavorites] = useLocalStorage('recipe-favorites', []);
  const [ratings, setRatings] = useLocalStorage('recipe-ratings', {});

  const toggleFavorite = (recipeId) => {
    setFavorites(prev =>
      prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const rateRecipe = (recipeId, stars) => {
    setRatings(prev => ({ ...prev, [recipeId]: stars }));
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <HomePage favorites={favorites} toggleFavorite={toggleFavorite} ratings={ratings} />
            } />
            <Route path="/search" element={
              <SearchPage favorites={favorites} toggleFavorite={toggleFavorite} ratings={ratings} />
            } />
            <Route path="/recipe/:id" element={
              <RecipeDetailPage
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                ratings={ratings}
                onRate={rateRecipe}
              />
            } />
            <Route path="/favorites" element={
              <FavoritesPage favorites={favorites} toggleFavorite={toggleFavorite} ratings={ratings} />
            } />
          </Routes>
        </main>
        <footer className="footer">
          <p>Smart Recipe Generator - Built with React</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
