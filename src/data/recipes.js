const recipes = [
  {
    id: 1,
    name: "Classic Margherita Pizza",
    cuisine: "Italian",
    difficulty: "Easy",
    cookingTime: 30,
    servings: 4,
    dietary: ["vegetarian"],
    ingredients: [
      { name: "pizza dough", amount: "1", unit: "ball" },
      { name: "tomato sauce", amount: "1/2", unit: "cup" },
      { name: "mozzarella cheese", amount: "200", unit: "g" },
      { name: "fresh basil", amount: "10", unit: "leaves" },
      { name: "olive oil", amount: "2", unit: "tbsp" },
      { name: "salt", amount: "1", unit: "tsp" }
    ],
    steps: [
      "Preheat oven to 475°F (245°C) with a pizza stone if available.",
      "Roll out pizza dough on a floured surface to desired thickness.",
      "Spread tomato sauce evenly over the dough, leaving a small border.",
      "Tear mozzarella into pieces and distribute over the sauce.",
      "Drizzle with olive oil and season with salt.",
      "Bake for 10-12 minutes until crust is golden and cheese is bubbly.",
      "Remove from oven, top with fresh basil leaves, and serve."
    ],
    nutrition: { calories: 266, protein: 12, carbs: 33, fat: 10, fiber: 2 },
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
    rating: 0,
    ratingCount: 0
  },
  {
    id: 2,
    name: "Chicken Stir Fry",
    cuisine: "Chinese",
    difficulty: "Easy",
    cookingTime: 20,
    servings: 4,
    dietary: ["gluten-free"],
    ingredients: [
      { name: "chicken breast", amount: "500", unit: "g" },
      { name: "bell pepper", amount: "2", unit: "pieces" },
      { name: "broccoli", amount: "1", unit: "cup" },
      { name: "soy sauce", amount: "3", unit: "tbsp" },
      { name: "garlic", amount: "3", unit: "cloves" },
      { name: "ginger", amount: "1", unit: "tbsp" },
      { name: "vegetable oil", amount: "2", unit: "tbsp" },
      { name: "cornstarch", amount: "1", unit: "tbsp" },
      { name: "rice", amount: "2", unit: "cups" }
    ],
    steps: [
      "Slice chicken breast into thin strips and toss with cornstarch.",
      "Mince garlic and grate ginger.",
      "Cut bell peppers into strips and break broccoli into florets.",
      "Heat oil in a wok over high heat until smoking.",
      "Add chicken and stir-fry for 3-4 minutes until golden.",
      "Add garlic, ginger, and vegetables. Stir-fry for 3 minutes.",
      "Add soy sauce and toss everything together.",
      "Serve hot over steamed rice."
    ],
    nutrition: { calories: 380, protein: 35, carbs: 28, fat: 14, fiber: 3 },
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
    rating: 0,
    ratingCount: 0
  },
  {
    id: 3,
    name: "Vegetable Curry",
    cuisine: "Indian",
    difficulty: "Medium",
    cookingTime: 40,
    servings: 4,
    dietary: ["vegetarian", "vegan", "gluten-free"],
    ingredients: [
      { name: "potato", amount: "2", unit: "pieces" },
      { name: "cauliflower", amount: "1", unit: "head" },
      { name: "chickpeas", amount: "1", unit: "can" },
      { name: "coconut milk", amount: "1", unit: "can" },
      { name: "onion", amount: "1", unit: "large" },
      { name: "garlic", amount: "4", unit: "cloves" },
      { name: "curry powder", amount: "2", unit: "tbsp" },
      { name: "tomato", amount: "2", unit: "pieces" },
      { name: "rice", amount: "2", unit: "cups" }
    ],
    steps: [
      "Dice onion and mince garlic. Cube potatoes and break cauliflower into florets.",
      "Heat oil in a large pot and sauté onion until translucent.",
      "Add garlic and curry powder, cook for 1 minute until fragrant.",
      "Add diced tomatoes and cook for 3 minutes.",
      "Add potatoes, cauliflower, and chickpeas. Stir to coat with sauce.",
      "Pour in coconut milk and bring to a simmer.",
      "Cover and cook for 25 minutes until vegetables are tender.",
      "Season with salt and serve over basmati rice."
    ],
    nutrition: { calories: 320, protein: 10, carbs: 42, fat: 14, fiber: 8 },
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
    rating: 0,
    ratingCount: 0
  },
  {
    id: 4,
    name: "Caesar Salad",
    cuisine: "American",
    difficulty: "Easy",
    cookingTime: 15,
    servings: 2,
    dietary: [],
    ingredients: [
      { name: "romaine lettuce", amount: "1", unit: "head" },
      { name: "parmesan cheese", amount: "50", unit: "g" },
      { name: "croutons", amount: "1", unit: "cup" },
      { name: "chicken breast", amount: "200", unit: "g" },
      { name: "lemon", amount: "1", unit: "piece" },
      { name: "garlic", amount: "2", unit: "cloves" },
      { name: "olive oil", amount: "3", unit: "tbsp" },
      { name: "egg", amount: "1", unit: "piece" }
    ],
    steps: [
      "Grill or pan-sear chicken breast until cooked through. Let rest and slice.",
      "Wash and chop romaine lettuce into bite-sized pieces.",
      "Make dressing: whisk egg yolk, minced garlic, lemon juice, and olive oil.",
      "Toss lettuce with dressing until evenly coated.",
      "Top with sliced chicken, croutons, and shaved parmesan.",
      "Season with black pepper and serve immediately."
    ],
    nutrition: { calories: 350, protein: 28, carbs: 15, fat: 20, fiber: 3 },
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
    rating: 0,
    ratingCount: 0
  },
  {
    id: 5,
    name: "Spaghetti Carbonara",
    cuisine: "Italian",
    difficulty: "Medium",
    cookingTime: 25,
    servings: 4,
    dietary: [],
    ingredients: [
      { name: "spaghetti", amount: "400", unit: "g" },
      { name: "bacon", amount: "200", unit: "g" },
      { name: "egg", amount: "4", unit: "pieces" },
      { name: "parmesan cheese", amount: "100", unit: "g" },
      { name: "garlic", amount: "2", unit: "cloves" },
      { name: "black pepper", amount: "1", unit: "tsp" }
    ],
    steps: [
      "Bring a large pot of salted water to boil and cook spaghetti al dente.",
      "While pasta cooks, cut bacon into small pieces and fry until crispy.",
      "Beat eggs with grated parmesan and black pepper in a bowl.",
      "When pasta is done, reserve 1 cup pasta water and drain.",
      "Add hot pasta to the bacon pan (off heat).",
      "Quickly pour egg mixture over pasta and toss vigorously.",
      "Add pasta water a little at a time to create a creamy sauce.",
      "Serve immediately with extra parmesan and black pepper."
    ],
    nutrition: { calories: 520, protein: 24, carbs: 55, fat: 22, fiber: 2 },
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400",
    rating: 0,
    ratingCount: 0
  },
  {
    id: 6,
    name: "Thai Green Curry",
    cuisine: "Thai",
    difficulty: "Medium",
    cookingTime: 35,
    servings: 4,
    dietary: ["gluten-free"],
    ingredients: [
      { name: "chicken thigh", amount: "500", unit: "g" },
      { name: "green curry paste", amount: "3", unit: "tbsp" },
      { name: "coconut milk", amount: "2", unit: "cans" },
      { name: "bamboo shoots", amount: "1", unit: "cup" },
      { name: "bell pepper", amount: "1", unit: "piece" },
      { name: "basil", amount: "1", unit: "cup" },
      { name: "fish sauce", amount: "2", unit: "tbsp" },
      { name: "sugar", amount: "1", unit: "tsp" },
      { name: "rice", amount: "2", unit: "cups" }
    ],
    steps: [
      "Cut chicken thighs into bite-sized pieces.",
      "Heat a tablespoon of coconut milk in a pot until oil separates.",
      "Add green curry paste and fry for 2 minutes until fragrant.",
      "Add chicken and cook for 5 minutes until sealed.",
      "Pour in remaining coconut milk and bring to a simmer.",
      "Add bamboo shoots and sliced bell pepper. Cook for 10 minutes.",
      "Season with fish sauce and sugar. Stir in Thai basil.",
      "Serve over jasmine rice."
    ],
    nutrition: { calories: 420, protein: 30, carbs: 18, fat: 28, fiber: 2 },
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400",
    rating: 0,
    ratingCount: 0
  },
  {
    id: 7,
    name: "Black Bean Tacos",
    cuisine: "Mexican",
    difficulty: "Easy",
    cookingTime: 20,
    servings: 4,
    dietary: ["vegetarian", "vegan"],
    ingredients: [
      { name: "black beans", amount: "2", unit: "cans" },
      { name: "tortilla", amount: "8", unit: "pieces" },
      { name: "avocado", amount: "2", unit: "pieces" },
      { name: "tomato", amount: "2", unit: "pieces" },
      { name: "onion", amount: "1", unit: "piece" },
      { name: "lime", amount: "2", unit: "pieces" },
      { name: "cilantro", amount: "1", unit: "bunch" },
      { name: "cumin", amount: "1", unit: "tsp" },
      { name: "chili powder", amount: "1", unit: "tsp" }
    ],
    steps: [
      "Drain and rinse black beans. Heat in a pan with cumin and chili powder.",
      "Mash beans slightly with a fork for texture.",
      "Dice tomato and onion for fresh salsa. Mix with lime juice and cilantro.",
      "Slice avocados and squeeze lime juice over them.",
      "Warm tortillas in a dry pan or microwave.",
      "Assemble tacos: beans, salsa, avocado slices.",
      "Squeeze extra lime on top and serve."
    ],
    nutrition: { calories: 290, protein: 12, carbs: 38, fat: 12, fiber: 10 },
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400",
    rating: 0,
    ratingCount: 0
  },
  {
    id: 8,
    name: "Japanese Miso Soup",
    cuisine: "Japanese",
    difficulty: "Easy",
    cookingTime: 15,
    servings: 4,
    dietary: ["vegetarian", "vegan"],
    ingredients: [
      { name: "miso paste", amount: "3", unit: "tbsp" },
      { name: "tofu", amount: "200", unit: "g" },
      { name: "seaweed", amount: "2", unit: "sheets" },
      { name: "green onion", amount: "2", unit: "stalks" },
      { name: "dashi stock", amount: "4", unit: "cups" }
    ],
    steps: [
      "Bring dashi stock to a gentle simmer in a pot.",
      "Cut tofu into small cubes.",
      "Cut seaweed into small pieces with scissors.",
      "Dissolve miso paste in a small amount of warm stock, then add to pot.",
      "Add tofu and seaweed. Simmer for 2-3 minutes (do not boil).",
      "Ladle into bowls and garnish with sliced green onion."
    ],
    nutrition: { calories: 85, protein: 7, carbs: 8, fat: 3, fiber: 2 },
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400",
    rating: 0,
    ratingCount: 0
  },
  {
    id: 9,
    name: "Greek Moussaka",
    cuisine: "Greek",
    difficulty: "Hard",
    cookingTime: 90,
    servings: 6,
    dietary: [],
    ingredients: [
      { name: "eggplant", amount: "2", unit: "large" },
      { name: "ground lamb", amount: "500", unit: "g" },
      { name: "onion", amount: "1", unit: "large" },
      { name: "tomato sauce", amount: "1", unit: "cup" },
      { name: "garlic", amount: "3", unit: "cloves" },
      { name: "milk", amount: "2", unit: "cups" },
      { name: "butter", amount: "3", unit: "tbsp" },
      { name: "flour", amount: "3", unit: "tbsp" },
      { name: "egg", amount: "2", unit: "pieces" },
      { name: "cinnamon", amount: "1/2", unit: "tsp" }
    ],
    steps: [
      "Slice eggplants into 1/4 inch rounds, salt and let drain for 30 minutes.",
      "Brown ground lamb with diced onion and garlic.",
      "Add tomato sauce and cinnamon. Simmer for 15 minutes.",
      "Pat eggplant dry and brush with oil. Broil until golden on both sides.",
      "Make bechamel: melt butter, whisk in flour, gradually add milk. Stir until thick.",
      "Remove from heat and whisk in beaten eggs.",
      "Layer eggplant, meat sauce, eggplant, then top with bechamel.",
      "Bake at 375°F for 45 minutes until golden on top. Rest 15 minutes before serving."
    ],
    nutrition: { calories: 440, protein: 25, carbs: 22, fat: 28, fiber: 5 },
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400",
    rating: 0,
    ratingCount: 0
  },
  {
    id: 10,
    name: "Pad Thai",
    cuisine: "Thai",
    difficulty: "Medium",
    cookingTime: 30,
    servings: 4,
    dietary: [],
    ingredients: [
      { name: "rice noodles", amount: "250", unit: "g" },
      { name: "shrimp", amount: "300", unit: "g" },
      { name: "egg", amount: "2", unit: "pieces" },
      { name: "bean sprouts", amount: "1", unit: "cup" },
      { name: "peanuts", amount: "1/4", unit: "cup" },
      { name: "green onion", amount: "3", unit: "stalks" },
      { name: "lime", amount: "1", unit: "piece" },
      { name: "fish sauce", amount: "3", unit: "tbsp" },
      { name: "sugar", amount: "2", unit: "tbsp" },
      { name: "garlic", amount: "3", unit: "cloves" }
    ],
    steps: [
      "Soak rice noodles in warm water for 20 minutes, then drain.",
      "Mix fish sauce, sugar, and tamarind paste for the sauce.",
      "Heat oil in a wok. Cook shrimp for 2 minutes per side. Set aside.",
      "Scramble eggs in the wok, then push to the side.",
      "Add garlic and noodles. Pour sauce over and toss for 2 minutes.",
      "Add shrimp, bean sprouts, and green onion. Toss together.",
      "Serve with crushed peanuts and lime wedges."
    ],
    nutrition: { calories: 390, protein: 22, carbs: 48, fat: 12, fiber: 2 },
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400",
    rating: 0,
    ratingCount: 0
  },
  {
    id: 11,
    name: "Mushroom Risotto",
    cuisine: "Italian",
    difficulty: "Medium",
    cookingTime: 45,
    servings: 4,
    dietary: ["vegetarian", "gluten-free"],
    ingredients: [
      { name: "arborio rice", amount: "300", unit: "g" },
      { name: "mushroom", amount: "300", unit: "g" },
      { name: "onion", amount: "1", unit: "piece" },
      { name: "garlic", amount: "2", unit: "cloves" },
      { name: "white wine", amount: "1/2", unit: "cup" },
      { name: "vegetable broth", amount: "4", unit: "cups" },
      { name: "parmesan cheese", amount: "50", unit: "g" },
      { name: "butter", amount: "2", unit: "tbsp" }
    ],
    steps: [
      "Heat broth in a saucepan and keep warm on low heat.",
      "Sauté sliced mushrooms in butter until golden. Set aside.",
      "Cook diced onion and garlic in olive oil until soft.",
      "Add rice and toast for 2 minutes, stirring constantly.",
      "Add wine and stir until absorbed.",
      "Add broth one ladle at a time, stirring until each is absorbed (about 20 min total).",
      "Stir in mushrooms, parmesan, and remaining butter.",
      "Season with salt and pepper. Serve immediately."
    ],
    nutrition: { calories: 380, protein: 12, carbs: 52, fat: 14, fiber: 3 },
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400",
    rating: 0,
    ratingCount: 0
  },
  {
    id: 12,
    name: "Fish and Chips",
    cuisine: "British",
    difficulty: "Medium",
    cookingTime: 40,
    servings: 4,
    dietary: [],
    ingredients: [
      { name: "cod fillet", amount: "4", unit: "pieces" },
      { name: "potato", amount: "4", unit: "large" },
      { name: "flour", amount: "1", unit: "cup" },
      { name: "beer", amount: "1", unit: "cup" },
      { name: "egg", amount: "1", unit: "piece" },
      { name: "vegetable oil", amount: "4", unit: "cups" },
      { name: "lemon", amount: "1", unit: "piece" },
      { name: "salt", amount: "2", unit: "tsp" }
    ],
    steps: [
      "Cut potatoes into thick chips. Soak in cold water for 30 minutes.",
      "Make batter: whisk flour, beer, egg, and salt until smooth.",
      "Heat oil to 350°F (175°C) in a deep pot.",
      "Dry chips thoroughly and fry for 5 minutes. Drain and set aside.",
      "Dip fish in batter, let excess drip off, and fry for 6-8 minutes.",
      "Re-fry chips for 3 minutes until golden and crispy.",
      "Serve with lemon wedges and tartar sauce."
    ],
    nutrition: { calories: 520, protein: 30, carbs: 55, fat: 18, fiber: 4 },
    image: "https://images.unsplash.com/photo-1579208030886-b1f5b7d0a5f0?w=400",
    rating: 0,
    ratingCount: 0
  },
  {
    id: 13,
    name: "Hummus Bowl",
    cuisine: "Middle Eastern",
    difficulty: "Easy",
    cookingTime: 15,
    servings: 2,
    dietary: ["vegetarian", "vegan", "gluten-free"],
    ingredients: [
      { name: "chickpeas", amount: "1", unit: "can" },
      { name: "tahini", amount: "2", unit: "tbsp" },
      { name: "lemon", amount: "1", unit: "piece" },
      { name: "garlic", amount: "2", unit: "cloves" },
      { name: "olive oil", amount: "3", unit: "tbsp" },
      { name: "cucumber", amount: "1", unit: "piece" },
      { name: "tomato", amount: "2", unit: "pieces" },
      { name: "pita bread", amount: "4", unit: "pieces" }
    ],
    steps: [
      "Drain chickpeas, reserving some liquid.",
      "Blend chickpeas, tahini, lemon juice, garlic, and olive oil until smooth.",
      "Add reserved liquid as needed for desired consistency.",
      "Dice cucumber and tomatoes for topping.",
      "Spread hummus in a bowl, top with veggies.",
      "Drizzle with olive oil and serve with warm pita bread."
    ],
    nutrition: { calories: 280, protein: 10, carbs: 30, fat: 14, fiber: 7 },
    image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400",
    rating: 0,
    ratingCount: 0
  },
  {
    id: 14,
    name: "Korean Bibimbap",
    cuisine: "Korean",
    difficulty: "Medium",
    cookingTime: 40,
    servings: 4,
    dietary: [],
    ingredients: [
      { name: "rice", amount: "2", unit: "cups" },
      { name: "ground beef", amount: "300", unit: "g" },
      { name: "spinach", amount: "200", unit: "g" },
      { name: "carrot", amount: "2", unit: "pieces" },
      { name: "zucchini", amount: "1", unit: "piece" },
      { name: "egg", amount: "4", unit: "pieces" },
      { name: "soy sauce", amount: "3", unit: "tbsp" },
      { name: "sesame oil", amount: "2", unit: "tbsp" },
      { name: "gochujang", amount: "2", unit: "tbsp" },
      { name: "garlic", amount: "3", unit: "cloves" }
    ],
    steps: [
      "Cook rice according to package directions.",
      "Marinate beef with soy sauce, sesame oil, and garlic for 15 minutes.",
      "Blanch spinach, squeeze dry, and season with sesame oil.",
      "Julienne carrots and zucchini. Sauté separately until tender.",
      "Cook marinated beef in a hot pan until browned.",
      "Fry eggs sunny-side up.",
      "Arrange rice in bowls, top with vegetables, beef, and fried egg.",
      "Serve with gochujang sauce on the side."
    ],
    nutrition: { calories: 450, protein: 25, carbs: 50, fat: 16, fiber: 4 },
    image: "https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400",
    rating: 0,
    ratingCount: 0
  },
  {
    id: 15,
    name: "Caprese Pasta",
    cuisine: "Italian",
    difficulty: "Easy",
    cookingTime: 20,
    servings: 4,
    dietary: ["vegetarian"],
    ingredients: [
      { name: "penne pasta", amount: "400", unit: "g" },
      { name: "cherry tomato", amount: "300", unit: "g" },
      { name: "mozzarella cheese", amount: "200", unit: "g" },
      { name: "fresh basil", amount: "1", unit: "cup" },
      { name: "olive oil", amount: "3", unit: "tbsp" },
      { name: "garlic", amount: "2", unit: "cloves" },
      { name: "balsamic vinegar", amount: "1", unit: "tbsp" }
    ],
    steps: [
      "Cook penne in salted boiling water until al dente.",
      "Halve cherry tomatoes and cube mozzarella.",
      "Sauté garlic in olive oil for 30 seconds.",
      "Add tomatoes and cook for 3 minutes until slightly softened.",
      "Toss drained pasta with tomato mixture.",
      "Add mozzarella and fresh basil. Drizzle with balsamic vinegar.",
      "Season with salt and pepper. Serve warm."
    ],
    nutrition: { calories: 420, protein: 18, carbs: 52, fat: 16, fiber: 3 },
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
    rating: 0,
    ratingCount: 0
  },
  {
    id: 16,
    name: "Chicken Tikka Masala",
    cuisine: "Indian",
    difficulty: "Medium",
    cookingTime: 45,
    servings: 4,
    dietary: ["gluten-free"],
    ingredients: [
      { name: "chicken breast", amount: "600", unit: "g" },
      { name: "yogurt", amount: "1", unit: "cup" },
      { name: "tomato sauce", amount: "2", unit: "cups" },
      { name: "onion", amount: "1", unit: "large" },
      { name: "garlic", amount: "4", unit: "cloves" },
      { name: "ginger", amount: "1", unit: "tbsp" },
      { name: "garam masala", amount: "2", unit: "tbsp" },
      { name: "cream", amount: "1/2", unit: "cup" },
      { name: "rice", amount: "2", unit: "cups" }
    ],
    steps: [
      "Cut chicken into cubes. Marinate in yogurt, garam masala, and salt for 30 min.",
      "Grill or broil chicken until charred on edges. Set aside.",
      "Sauté diced onion in butter until golden.",
      "Add garlic, ginger, and remaining spices. Cook 2 minutes.",
      "Add tomato sauce and simmer for 15 minutes.",
      "Stir in cream and add cooked chicken pieces.",
      "Simmer for 10 more minutes. Garnish with cilantro.",
      "Serve over basmati rice or with naan bread."
    ],
    nutrition: { calories: 420, protein: 38, carbs: 25, fat: 18, fiber: 3 },
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
    rating: 0,
    ratingCount: 0
  },
  {
    id: 17,
    name: "Avocado Toast",
    cuisine: "American",
    difficulty: "Easy",
    cookingTime: 10,
    servings: 2,
    dietary: ["vegetarian", "vegan"],
    ingredients: [
      { name: "bread", amount: "4", unit: "slices" },
      { name: "avocado", amount: "2", unit: "pieces" },
      { name: "lemon", amount: "1", unit: "piece" },
      { name: "cherry tomato", amount: "8", unit: "pieces" },
      { name: "red pepper flakes", amount: "1/2", unit: "tsp" },
      { name: "salt", amount: "1/2", unit: "tsp" }
    ],
    steps: [
      "Toast bread slices until golden and crispy.",
      "Halve avocados and scoop into a bowl.",
      "Mash with a fork, leaving some chunks.",
      "Mix in lemon juice, salt, and red pepper flakes.",
      "Spread avocado mixture generously on toast.",
      "Top with halved cherry tomatoes and extra seasoning."
    ],
    nutrition: { calories: 280, protein: 6, carbs: 28, fat: 18, fiber: 8 },
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400",
    rating: 0,
    ratingCount: 0
  },
  {
    id: 18,
    name: "Beef Bulgogi",
    cuisine: "Korean",
    difficulty: "Medium",
    cookingTime: 35,
    servings: 4,
    dietary: [],
    ingredients: [
      { name: "beef sirloin", amount: "500", unit: "g" },
      { name: "soy sauce", amount: "4", unit: "tbsp" },
      { name: "sugar", amount: "2", unit: "tbsp" },
      { name: "sesame oil", amount: "2", unit: "tbsp" },
      { name: "garlic", amount: "4", unit: "cloves" },
      { name: "pear", amount: "1/2", unit: "piece" },
      { name: "onion", amount: "1", unit: "piece" },
      { name: "green onion", amount: "3", unit: "stalks" },
      { name: "rice", amount: "2", unit: "cups" }
    ],
    steps: [
      "Slice beef very thinly against the grain.",
      "Blend pear, soy sauce, sugar, sesame oil, and garlic for marinade.",
      "Marinate beef for at least 30 minutes (or overnight).",
      "Slice onion into rings and chop green onions.",
      "Heat a grill or pan to high heat.",
      "Cook beef in batches for 2-3 minutes per side.",
      "Serve over rice with sliced green onion garnish."
    ],
    nutrition: { calories: 380, protein: 32, carbs: 30, fat: 14, fiber: 2 },
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400",
    rating: 0,
    ratingCount: 0
  },
  {
    id: 19,
    name: "Mediterranean Quinoa Bowl",
    cuisine: "Mediterranean",
    difficulty: "Easy",
    cookingTime: 25,
    servings: 2,
    dietary: ["vegetarian", "vegan", "gluten-free"],
    ingredients: [
      { name: "quinoa", amount: "1", unit: "cup" },
      { name: "cucumber", amount: "1", unit: "piece" },
      { name: "cherry tomato", amount: "1", unit: "cup" },
      { name: "olive", amount: "1/2", unit: "cup" },
      { name: "red onion", amount: "1/4", unit: "piece" },
      { name: "lemon", amount: "1", unit: "piece" },
      { name: "olive oil", amount: "3", unit: "tbsp" },
      { name: "fresh herbs", amount: "1/4", unit: "cup" }
    ],
    steps: [
      "Cook quinoa according to package directions. Let cool.",
      "Dice cucumber, halve cherry tomatoes, slice olives.",
      "Thinly slice red onion.",
      "Whisk lemon juice, olive oil, salt, and pepper for dressing.",
      "Combine quinoa with all vegetables.",
      "Toss with dressing and fresh herbs.",
      "Serve at room temperature or chilled."
    ],
    nutrition: { calories: 320, protein: 10, carbs: 38, fat: 16, fiber: 6 },
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    rating: 0,
    ratingCount: 0
  },
  {
    id: 20,
    name: "Butter Chicken",
    cuisine: "Indian",
    difficulty: "Medium",
    cookingTime: 50,
    servings: 4,
    dietary: ["gluten-free"],
    ingredients: [
      { name: "chicken thigh", amount: "600", unit: "g" },
      { name: "butter", amount: "3", unit: "tbsp" },
      { name: "tomato sauce", amount: "2", unit: "cups" },
      { name: "cream", amount: "1/2", unit: "cup" },
      { name: "onion", amount: "1", unit: "large" },
      { name: "garlic", amount: "4", unit: "cloves" },
      { name: "ginger", amount: "1", unit: "tbsp" },
      { name: "garam masala", amount: "2", unit: "tsp" },
      { name: "yogurt", amount: "1/2", unit: "cup" },
      { name: "rice", amount: "2", unit: "cups" }
    ],
    steps: [
      "Marinate chicken in yogurt, garam masala, and salt for 1 hour.",
      "Grill or pan-fry chicken until charred. Set aside.",
      "Melt butter and sauté onion, garlic, and ginger.",
      "Add tomato sauce and simmer for 20 minutes.",
      "Blend sauce until smooth, return to pot.",
      "Add cream and cooked chicken. Simmer 10 minutes.",
      "Finish with a knob of butter.",
      "Serve with basmati rice and naan."
    ],
    nutrition: { calories: 460, protein: 35, carbs: 22, fat: 26, fiber: 3 },
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400",
    rating: 0,
    ratingCount: 0
  },
  {
    id: 21,
    name: "Shakshuka",
    cuisine: "Middle Eastern",
    difficulty: "Easy",
    cookingTime: 25,
    servings: 4,
    dietary: ["vegetarian", "gluten-free"],
    ingredients: [
      { name: "egg", amount: "6", unit: "pieces" },
      { name: "tomato", amount: "4", unit: "large" },
      { name: "bell pepper", amount: "1", unit: "piece" },
      { name: "onion", amount: "1", unit: "piece" },
      { name: "garlic", amount: "3", unit: "cloves" },
      { name: "cumin", amount: "1", unit: "tsp" },
      { name: "paprika", amount: "1", unit: "tsp" },
      { name: "olive oil", amount: "2", unit: "tbsp" },
      { name: "bread", amount: "4", unit: "slices" }
    ],
    steps: [
      "Dice onion, bell pepper, and tomatoes. Mince garlic.",
      "Heat olive oil in a large skillet. Sauté onion and pepper for 5 minutes.",
      "Add garlic, cumin, and paprika. Cook 1 minute.",
      "Add tomatoes and simmer for 10 minutes until thickened.",
      "Make 6 wells in the sauce and crack an egg into each.",
      "Cover and cook for 5-7 minutes until eggs are set.",
      "Serve in the skillet with crusty bread for dipping."
    ],
    nutrition: { calories: 250, protein: 14, carbs: 18, fat: 14, fiber: 4 },
    image: "https://images.unsplash.com/photo-1590412200988-a436970781fa?w=400",
    rating: 0,
    ratingCount: 0
  },
  {
    id: 22,
    name: "Teriyaki Salmon",
    cuisine: "Japanese",
    difficulty: "Easy",
    cookingTime: 20,
    servings: 2,
    dietary: ["gluten-free"],
    ingredients: [
      { name: "salmon fillet", amount: "2", unit: "pieces" },
      { name: "soy sauce", amount: "3", unit: "tbsp" },
      { name: "honey", amount: "2", unit: "tbsp" },
      { name: "garlic", amount: "2", unit: "cloves" },
      { name: "ginger", amount: "1", unit: "tsp" },
      { name: "rice", amount: "1", unit: "cup" },
      { name: "broccoli", amount: "1", unit: "cup" },
      { name: "sesame seeds", amount: "1", unit: "tbsp" }
    ],
    steps: [
      "Mix soy sauce, honey, minced garlic, and grated ginger for glaze.",
      "Pat salmon fillets dry and season with salt.",
      "Heat oil in a pan over medium-high heat.",
      "Cook salmon skin-side up for 4 minutes.",
      "Flip and pour teriyaki glaze over. Cook 3 more minutes.",
      "Steam broccoli until tender-crisp.",
      "Serve salmon over rice with broccoli. Sprinkle sesame seeds."
    ],
    nutrition: { calories: 420, protein: 36, carbs: 35, fat: 16, fiber: 3 },
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
    rating: 0,
    ratingCount: 0
  },
  {
    id: 23,
    name: "Lentil Soup",
    cuisine: "Mediterranean",
    difficulty: "Easy",
    cookingTime: 35,
    servings: 6,
    dietary: ["vegetarian", "vegan", "gluten-free"],
    ingredients: [
      { name: "red lentils", amount: "2", unit: "cups" },
      { name: "onion", amount: "1", unit: "large" },
      { name: "carrot", amount: "2", unit: "pieces" },
      { name: "celery", amount: "2", unit: "stalks" },
      { name: "garlic", amount: "3", unit: "cloves" },
      { name: "vegetable broth", amount: "6", unit: "cups" },
      { name: "cumin", amount: "1", unit: "tsp" },
      { name: "lemon", amount: "1", unit: "piece" },
      { name: "olive oil", amount: "2", unit: "tbsp" }
    ],
    steps: [
      "Dice onion, carrots, and celery. Mince garlic.",
      "Heat olive oil in a pot. Sauté vegetables for 5 minutes.",
      "Add garlic and cumin. Cook 1 minute.",
      "Add rinsed lentils and vegetable broth.",
      "Bring to a boil, then simmer for 25 minutes until lentils are soft.",
      "Blend partially for a creamy texture (or leave chunky).",
      "Season with lemon juice, salt, and pepper. Serve warm."
    ],
    nutrition: { calories: 220, protein: 14, carbs: 35, fat: 4, fiber: 12 },
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400",
    rating: 0,
    ratingCount: 0
  },
  {
    id: 24,
    name: "Falafel Wrap",
    cuisine: "Middle Eastern",
    difficulty: "Medium",
    cookingTime: 35,
    servings: 4,
    dietary: ["vegetarian", "vegan"],
    ingredients: [
      { name: "chickpeas", amount: "2", unit: "cans" },
      { name: "onion", amount: "1", unit: "piece" },
      { name: "garlic", amount: "4", unit: "cloves" },
      { name: "cilantro", amount: "1", unit: "cup" },
      { name: "cumin", amount: "2", unit: "tsp" },
      { name: "flour", amount: "2", unit: "tbsp" },
      { name: "tortilla", amount: "4", unit: "large" },
      { name: "cucumber", amount: "1", unit: "piece" },
      { name: "tomato", amount: "2", unit: "pieces" },
      { name: "tahini", amount: "3", unit: "tbsp" }
    ],
    steps: [
      "Blend chickpeas, onion, garlic, cilantro, and cumin in a food processor.",
      "Mix in flour. Form into small patties.",
      "Fry falafel in oil for 3-4 minutes per side until golden.",
      "Slice cucumber and tomatoes.",
      "Make tahini sauce: mix tahini with lemon juice and water.",
      "Warm tortillas and fill with falafel, veggies, and tahini sauce.",
      "Wrap tightly and serve."
    ],
    nutrition: { calories: 380, protein: 15, carbs: 48, fat: 14, fiber: 9 },
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400",
    rating: 0,
    ratingCount: 0
  },
  {
    id: 25,
    name: "Banana Pancakes",
    cuisine: "American",
    difficulty: "Easy",
    cookingTime: 15,
    servings: 2,
    dietary: ["vegetarian"],
    ingredients: [
      { name: "banana", amount: "2", unit: "pieces" },
      { name: "egg", amount: "2", unit: "pieces" },
      { name: "flour", amount: "1/2", unit: "cup" },
      { name: "milk", amount: "1/4", unit: "cup" },
      { name: "baking powder", amount: "1", unit: "tsp" },
      { name: "butter", amount: "1", unit: "tbsp" },
      { name: "maple syrup", amount: "2", unit: "tbsp" }
    ],
    steps: [
      "Mash bananas in a bowl until smooth.",
      "Whisk in eggs, milk, flour, and baking powder until smooth.",
      "Heat butter in a non-stick pan over medium heat.",
      "Pour 1/4 cup batter for each pancake.",
      "Cook for 2-3 minutes until bubbles form, then flip.",
      "Cook another 1-2 minutes until golden.",
      "Stack and drizzle with maple syrup."
    ],
    nutrition: { calories: 320, protein: 10, carbs: 48, fat: 10, fiber: 3 },
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
    rating: 0,
    ratingCount: 0
  }
];

export default recipes;

export const allIngredients = [...new Set(
  recipes.flatMap(r => r.ingredients.map(i => i.name))
)].sort();

export const cuisines = [...new Set(recipes.map(r => r.cuisine))].sort();

export const dietaryOptions = ["vegetarian", "vegan", "gluten-free"];

export const difficultyLevels = ["Easy", "Medium", "Hard"];
