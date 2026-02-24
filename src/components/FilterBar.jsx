import { Filter, X } from 'lucide-react';
import { cuisines, dietaryOptions, difficultyLevels } from '../data/recipes';

export default function FilterBar({ filters, setFilters }) {
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleDietary = (option) => {
    setFilters(prev => {
      const current = prev.dietary || [];
      return {
        ...prev,
        dietary: current.includes(option)
          ? current.filter(d => d !== option)
          : [...current, option]
      };
    });
  };

  const clearFilters = () => {
    setFilters({ dietary: [], difficulty: '', maxCookingTime: 0, cuisine: '' });
  };

  const hasFilters = filters.difficulty || filters.maxCookingTime || filters.cuisine ||
    (filters.dietary && filters.dietary.length > 0);

  return (
    <div className="filter-bar">
      <div className="filter-header">
        <h3><Filter size={18} /> Filters</h3>
        {hasFilters && (
          <button className="clear-filters" onClick={clearFilters}>
            <X size={14} /> Clear
          </button>
        )}
      </div>

      <div className="filter-groups">
        <div className="filter-group">
          <label>Dietary</label>
          <div className="filter-options">
            {dietaryOptions.map(opt => (
              <button
                key={opt}
                className={`filter-chip ${(filters.dietary || []).includes(opt) ? 'active' : ''}`}
                onClick={() => toggleDietary(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Difficulty</label>
          <div className="filter-options">
            {difficultyLevels.map(level => (
              <button
                key={level}
                className={`filter-chip ${filters.difficulty === level ? 'active' : ''}`}
                onClick={() => updateFilter('difficulty', filters.difficulty === level ? '' : level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Max Cooking Time</label>
          <div className="filter-options">
            {[15, 30, 45, 60, 90].map(time => (
              <button
                key={time}
                className={`filter-chip ${filters.maxCookingTime === time ? 'active' : ''}`}
                onClick={() => updateFilter('maxCookingTime', filters.maxCookingTime === time ? 0 : time)}
              >
                {time} min
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Cuisine</label>
          <select
            value={filters.cuisine || ''}
            onChange={(e) => updateFilter('cuisine', e.target.value)}
            className="filter-select"
          >
            <option value="">All Cuisines</option>
            {cuisines.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
