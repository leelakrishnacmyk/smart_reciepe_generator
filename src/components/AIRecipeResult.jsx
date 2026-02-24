import { ChefHat, Clock, Flame, Users, X } from 'lucide-react';

export default function AIRecipeResult({ result, onClose }) {
    if (!result) return null;

    const { dishName, cuisine, fullIngredients, recipe, nutrition } = result;

    return (
        <div className="ai-recipe-result">
            <div className="ai-recipe-header">
                <div>
                    <h2><ChefHat size={24} /> {dishName}</h2>
                    {cuisine && <span className="ai-cuisine-tag">{cuisine}</span>}
                </div>
                <button className="ai-close-btn" onClick={onClose} aria-label="Close">
                    <X size={20} />
                </button>
            </div>

            <div className="ai-recipe-meta">
                {recipe?.prepTime && (
                    <span><Clock size={16} /> Prep: {recipe.prepTime}</span>
                )}
                {recipe?.cookTime && (
                    <span><Clock size={16} /> Cook: {recipe.cookTime}</span>
                )}
                {recipe?.servings && (
                    <span><Users size={16} /> Serves: {recipe.servings}</span>
                )}
                {recipe?.difficulty && (
                    <span><Flame size={16} /> {recipe.difficulty}</span>
                )}
            </div>

            {/* Nutrition */}
            {nutrition && Object.keys(nutrition).length > 0 && (
                <div className="ai-nutrition">
                    {nutrition.calories && <span className="ai-nut-item"><strong>{nutrition.calories}</strong> cal</span>}
                    {nutrition.protein && <span className="ai-nut-item"><strong>{nutrition.protein}</strong> protein</span>}
                    {nutrition.carbs && <span className="ai-nut-item"><strong>{nutrition.carbs}</strong> carbs</span>}
                    {nutrition.fat && <span className="ai-nut-item"><strong>{nutrition.fat}</strong> fat</span>}
                    {nutrition.fiber && <span className="ai-nut-item"><strong>{nutrition.fiber}</strong> fiber</span>}
                </div>
            )}

            {/* Ingredients */}
            {fullIngredients && fullIngredients.length > 0 && (
                <div className="ai-section">
                    <h3>🧂 Ingredients</h3>
                    <ul className="ai-ingredients-list">
                        {fullIngredients.map((ing, idx) => (
                            <li key={idx}>
                                {ing.quantity && <span className="ai-qty">{ing.quantity}</span>}
                                <span>{ing.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Steps */}
            {recipe?.steps && recipe.steps.length > 0 && (
                <div className="ai-section">
                    <h3>👨‍🍳 Cooking Steps</h3>
                    <ol className="ai-steps-list">
                        {recipe.steps.map((step, idx) => (
                            <li key={idx}>
                                <span className="ai-step-num">{idx + 1}</span>
                                <span className="ai-step-text">{step}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            <p className="ai-powered-note">🤖 AI-generated recipe — verify measurements and cooking times</p>
        </div>
    );
}
