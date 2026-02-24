import { useState, useRef } from 'react';
import { Plus, X, Camera, Loader } from 'lucide-react';
import { allIngredients } from '../data/recipes';
import { analyzeImage } from '../utils/imageRecognition';

export default function IngredientInput({ ingredients, setIngredients }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeStatus, setAnalyzeStatus] = useState('');
  const [imageMessage, setImageMessage] = useState('');
  const [imageMessageType, setImageMessageType] = useState('info');
  const fileInputRef = useRef(null);

  const addIngredient = (name) => {
    const trimmed = name.trim().toLowerCase();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
    }
    setInput('');
    setSuggestions([]);
  };

  const removeIngredient = (name) => {
    setIngredients(ingredients.filter(i => i !== name));
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    if (val.length > 0) {
      const filtered = allIngredients.filter(i =>
        i.toLowerCase().includes(val.toLowerCase()) &&
        !ingredients.includes(i.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8));
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      addIngredient(input);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setImageMessage('');
    setAnalyzeStatus('Analyzing image...');
    try {
      const result = await analyzeImage(file, (statusMsg) => {
        setAnalyzeStatus(statusMsg);
      });
      setAnalyzeStatus('');
      setImageMessage(result.message);
      setImageMessageType('success');
      const newIngredients = result.ingredients.filter(
        i => !ingredients.includes(i.toLowerCase())
      );
      setIngredients([...ingredients, ...newIngredients.map(i => i.toLowerCase())]);
    } catch (err) {
      setImageMessage(err.message || 'Failed to analyze image.');
      setImageMessageType('error');
    } finally {
      setIsAnalyzing(false);
      setAnalyzeStatus('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="ingredient-input-container">
      <div className="input-row">
        <div className="input-wrapper">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type an ingredient (e.g., chicken, tomato, rice)..."
            className="ingredient-text-input"
          />
          {input.trim() && (
            <button className="btn-add" onClick={() => addIngredient(input)}>
              <Plus size={18} />
            </button>
          )}
        </div>
        <button
          className="btn-upload"
          onClick={() => fileInputRef.current?.click()}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? <Loader size={18} className="spin" /> : <Camera size={18} />}
          <span>{isAnalyzing ? (analyzeStatus || 'Analyzing...') : 'Upload Photo'}</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
      </div>

      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map(s => (
            <li key={s} onClick={() => addIngredient(s)}>{s}</li>
          ))}
        </ul>
      )}

      {imageMessage && (
        <p className={`image-message ${imageMessageType}`}>{imageMessage}</p>
      )}

      {ingredients.length > 0 && (
        <div className="ingredient-tags">
          {ingredients.map(i => (
            <span key={i} className="tag">
              {i}
              <button onClick={() => removeIngredient(i)} aria-label={`Remove ${i}`}>
                <X size={14} />
              </button>
            </span>
          ))}
          {ingredients.length > 1 && (
            <button className="clear-all" onClick={() => setIngredients([])}>
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}
