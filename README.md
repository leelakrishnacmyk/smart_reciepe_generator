# 🍳 Smart Recipe Generator

An AI-powered recipe discovery app that lets users find recipes by entering ingredients, uploading food photos, or simply typing a dish name. Built with **React + Vite** frontend and **Vercel Serverless Functions** backend.

**🔗 Live Demo**: [https://smart-reciepe-generator.vercel.app](https://smart-reciepe-generator.vercel.app)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Ingredient Input** | Text input with autocomplete suggestions from 100+ ingredients |
| **AI Recipe by Name** | Type any dish name → AI generates full recipe with ingredients, steps, and nutrition (via OpenRouter) |
| **Image Recognition** | Upload a food photo → AI identifies the dish name + full recipe (via OpenRouter vision models) |
| **Recipe Matching** | Smart algorithm scores recipes by ingredient overlap with match percentages |
| **Filters** | Filter by dietary preference (vegetarian, vegan, gluten-free), difficulty, cooking time, cuisine |
| **Serving Size Adjuster** | Dynamically scales ingredient quantities and nutritional info |
| **Substitution Suggestions** | Recommends alternatives for missing ingredients |
| **User Feedback** | Star ratings + favorites saved to localStorage |
| **Recipe Suggestions** | Personalized recommendations based on user ratings, cuisine preferences, and dietary patterns |
| **Nutritional Info** | Calories, protein, carbs, fat, and fiber for every recipe |
| **Mobile Responsive** | Fully responsive design for all screen sizes |

---

## 🏗️ Architecture

```
smart-recipe-generator/
├── server/
│   └── server.js              # Express.js backend (API endpoints)
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar with active route highlighting
│   │   ├── IngredientInput.jsx # Text input + image upload component
│   │   ├── FilterBar.jsx       # Dietary, difficulty, time, cuisine filters
│   │   ├── RecipeCard.jsx      # Recipe preview card with match %
│   │   ├── AIRecipeResult.jsx  # Displays AI-generated recipe from image
│   │   ├── StarRating.jsx      # Interactive 5-star rating
│   │   └── LoadingSpinner.jsx  # Loading state indicator
│   ├── pages/
│   │   ├── HomePage.jsx        # Hero section + featured + top-rated recipes
│   │   ├── SearchPage.jsx      # Ingredient search + filters + AI recipe display
│   │   ├── RecipeDetailPage.jsx# Full recipe view with serving adjuster
│   │   └── FavoritesPage.jsx   # Saved favorites + personalized suggestions
│   ├── data/
│   │   └── recipes.js          # 25 recipes across 12 cuisines
│   ├── hooks/
│   │   └── useLocalStorage.js  # Persistent state hook for favorites/ratings
│   ├── utils/
│   │   ├── recipeMatching.js   # Matching algorithm + substitution engine
│   │   └── imageRecognition.js # Calls backend API for image analysis
│   ├── App.jsx                 # Root component with routing
│   ├── App.css                 # Reset styles
│   ├── index.css               # Full application stylesheet
│   └── main.jsx                # Entry point
├── .env                        # API keys (gitignored)
├── .gitignore
├── index.html
├── package.json
└── vite.config.js              # Vite config with API proxy
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analyze-image` | Accepts `{ image: base64, mimeType: string }`, returns dish name, ingredients, recipe steps, and nutrition |
| `POST` | `/api/generate-recipe` | Accepts `{ dishName: string }`, returns full AI-generated recipe |
| `GET`  | `/api/debug` | Returns API key configuration status |

### POST /api/analyze-image — Request

```json
{
  "image": "<base64 encoded image data>",
  "mimeType": "image/jpeg"
}
```

### POST /api/analyze-image — Response

```json
{
  "dishName": "Chicken Biryani",
  "cuisine": "Indian",
  "ingredients": [
    { "name": "basmati rice", "quantity": "2 cups" },
    { "name": "chicken", "quantity": "500g" }
  ],
  "recipe": {
    "servings": 4,
    "prepTime": "20 mins",
    "cookTime": "45 mins",
    "difficulty": "Medium",
    "steps": [
      "Marinate chicken with yogurt and spices for 30 minutes",
      "Cook rice until 70% done, drain and set aside",
      "..."
    ]
  },
  "nutrition": {
    "calories": 450,
    "protein": "28g",
    "carbs": "55g",
    "fat": "12g",
    "fiber": "3g"
  }
}
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** v9+
- An API key from [OpenRouter](https://openrouter.ai/keys) (free, no credit card required)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd smart-recipe-generator

# Install dependencies
npm install
```

### Configuration

Create a `.env` file in the project root:

```env
OPENROUTER_API_KEY=sk-or-your-key-here
```

> Get your free key at [openrouter.ai/keys](https://openrouter.ai/keys).

### Running Locally

Open **two terminals**:

```bash
# Terminal 1 — Start the backend server
npm run dev:server
# → Express API running on http://localhost:3001

# Terminal 2 — Start the frontend dev server
npm run dev
# → Vite running on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

### Building for Production

```bash
npm run build
# Output in dist/ folder
```

---

## 🧠 Approach Write-Up (200 words)

The Smart Recipe Generator uses a **two-tier architecture**: a React frontend for the UI and an Express.js backend for secure AI API communication.

**Ingredient Classification**: Users input ingredients via text (with autocomplete from a curated database of 100+ ingredients), by uploading food photos, or by typing a dish name for AI recipe generation. Images and text prompts are sent to the backend via **POST** requests, where OpenRouter's free models identify the dish and extract individual ingredients using structured JSON prompting.

**Recipe Matching Logic**: A scoring algorithm computes the overlap between user-provided ingredients and each recipe's ingredient list. Recipes are ranked by match percentage, with partial matches weighted by ingredient importance. The system also suggests **substitutions** for missing ingredients (e.g., Greek yogurt → sour cream).

**Error Handling**: The backend implements retry logic with exponential backoff for rate-limited APIs, graceful fallback between two AI providers, and robust JSON parsing that handles multiple response formats. The frontend shows real-time status updates during analysis and meaningful error messages.

**User Experience**: The interface features responsive design, animated transitions, dietary/difficulty/time filters, a serving size adjuster that dynamically scales quantities, and a personalized suggestion engine that learns from user ratings and favorites to recommend recipes matching their cuisine and difficulty preferences.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, React Router 7, Lucide Icons |
| Backend | Express.js, Node.js |
| AI/ML | OpenRouter (free vision + text models) |
| Build | Vite 7 |
| Storage | localStorage (favorites, ratings) |
| Styling | Vanilla CSS with CSS variables |

---

## 📦 Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Frontend dev | `npm run dev` | Start Vite dev server (port 5173) |
| Backend dev | `npm run dev:server` | Start Express API (port 3001) |
| Build | `npm run build` | Production build to `dist/` |
| Preview | `npm run preview` | Preview production build |
| Lint | `npm run lint` | Run ESLint |

---

## 📄 License

MIT
