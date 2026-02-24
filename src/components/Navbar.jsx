import { Link, useLocation } from 'react-router-dom';
import { ChefHat, Heart, Search, Home } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const links = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/search', icon: Search, label: 'Find Recipes' },
    { to: '/favorites', icon: Heart, label: 'Favorites' },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <ChefHat size={28} />
        <span>Smart Recipe Generator</span>
      </Link>
      <div className="navbar-links">
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`nav-link ${location.pathname === to ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
