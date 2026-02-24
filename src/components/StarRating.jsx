import { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating, onRate, size = 24 }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          className="star-btn"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onRate(star)}
          aria-label={`Rate ${star} stars`}
        >
          <Star
            size={size}
            fill={(hover || rating) >= star ? '#f59e0b' : 'none'}
            stroke={(hover || rating) >= star ? '#f59e0b' : '#d1d5db'}
          />
        </button>
      ))}
      {rating > 0 && <span className="rating-text">{rating}/5</span>}
    </div>
  );
}
