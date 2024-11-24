import React, { useState, useEffect } from 'react';
import './RecipeGeneratorPage.css';

function RecipeGeneratorPage() {
  const [currentPantry, setCurrentPantry] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dietaryRestrictions, setDietaryRestrictions] = useState('none');
  const [difficulty, setDifficulty] = useState('medium');
  const [style, setStyle] = useState('American');
  const [types, setTypes] = useState('Dinner');

  useEffect(() => {
    fetchCurrentPantry();
  }, []);

  const fetchCurrentPantry = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/current_pantry');
      if (!response.ok) {
        throw new Error('Failed to fetch pantry data');
      }
      const data = await response.json();
      setCurrentPantry(data);
    } catch (error) {
      console.error('Error fetching pantry:', error);
      setError('Failed to load pantry data. Please try again.');
    }
  };

  const addToPantry = async (ingredient) => {
    try {
       let curr_pantry = await fetch("http://localhost:3001/api/current_pantry");
       if (!curr_pantry.ok)
       {
        throw new Error("Failed to fetch current pantry");
       }

       let {pantryName} = await curr_pantry.json();
       
       if (!pantryName) 
       {
        alert("No current Pantry set.");
        return;
       }

       let rsp = await fetch("http://localhost:3001/api/store_ingredient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pantryName,
          name: ingredient,
          category: ingredient
        }),
      });
    
      // Handle the response
      if (rsp.ok) {
        console.log(`Ingredient ${ingredient} added successfully.`);
        // Optionally, update the state or UI to reflect the change
      } else {
        console.error(`Failed to add ingredient: ${ingredient}.`);
      }
    } catch (error) {
      console.error("Error adding ingredient:", error);
    }
  };

  const generateRecipe = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!currentPantry?.ingredients) {
        throw new Error('No ingredients available in pantry');
      }
      console.log(currentPantry.ingredients);
      console.log(dietaryRestrictions);
      console.log(style);
      console.log(types);
      console.log(difficulty);

      const response = await fetch('http://localhost:3001/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: currentPantry.ingredients.map(ing => ing.name),
          dietaryRestrictions,
          style,
          types,
          difficulty
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipe');
      }

      const data = await response.json();
      
      // Validate the recipe data structure
      console.log(data);

      
      if (!isValidRecipeData(data)) {
        throw new Error('Invalid recipe data received');
      }

      setRecipe(data);
    } catch (error) {
      console.error('Error generating recipe:', error);
      setError(error.message || 'Failed to generate recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to validate recipe data structure
  const isValidRecipeData = (data) => {
    return data &&
      Array.isArray(data.availableIngredients) &&
      Array.isArray(data.missingIngredients) &&
      Array.isArray(data.instructions) &&
      typeof data.name === 'string' &&
      typeof data.prepTime === 'string' &&
      typeof data.cookingTime === 'string' &&
      typeof data.style === 'string' &&
      typeof data.types === 'string' &&
      typeof data.difficulty === 'string' &&
      typeof data.servings === 'string';
  };

  return (
    <div className="recipe-container">      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Preferences Card */}
      <div className="preferences-card">
        <h2 className="preferences-title">Recipe Preferences</h2>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Dietary Restrictions</label>
            <select 
              className="form-select"
              value={dietaryRestrictions}
              onChange={(e) => setDietaryRestrictions(e.target.value)}
            >
              <option value="none">None</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="gluten-free">Gluten-free</option>
              <option value="dairy-free">Dairy-free</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Meal Style</label>
            <select 
              className="form-select"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            >
              <option value="American">American</option>
              <option value="Cajun">Cajun</option>
              <option value="Chinese">Chinese</option>
              <option value="Italian">Italian</option>
              <option value="Indian">Indian</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Type of Meal</label>
            <select 
              className="form-select"
              value={types}
              onChange={(e) => setTypes(e.target.value)}
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>

          
          <div className="form-group">
            <label className="form-label">Difficulty Level</label>
            <select 
              className="form-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          <button 
            className="generate-button"
            onClick={generateRecipe} 
            disabled={loading || !currentPantry}
          >
            {loading ? 'Generating...' : 'Generate Recipe'}
          </button>
        </div>
      </div>

      {/* Recipe Display */}
      {recipe && (
        <div className="recipe-card">
          <h2 className="recipe-name">{recipe.name}</h2>
          
          {/* Ingredients Section */}
          <div className="ingredients-section">
            <h3 className="ingredients-title">Ingredients</h3>
            <div className="ingredients-list">
              <div className="ingredients-category">
                <h4 className="category-title available">From Your Pantry:</h4>
                <ul>
                  {recipe.availableIngredients.map((ingredient, index) => (
                    <li key={`available-${index}`}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              
              <div className="ingredients-category">
                <h4 className="category-title missing">Need to Purchase:</h4>
                  <ul>
                    {recipe.missingIngredients.map((ingredient, index) => (
                      <li key={`missing-${index}`}>
                        {ingredient}
                        <button
                          className="add-to-pantry-button"
                          onClick={() => addToPantry(ingredient)}
                        >
                          Add
                        </button>
                      </li>
                    ))}
                  </ul>
              </div>
            </div>
          </div>

          {/* Instructions Section */}
          <div className="instructions-section">
            <h3 className="instructions-title">Instructions</h3>
            <ol className="instructions-list">
              {recipe.instructions.map((step, index) => (
                <li key={`step-${index}`}>{step}</li>
              ))}
            </ol>
          </div>

          {/* Recipe Metadata */}
          <div className="recipe-meta">
            <div className="meta-item">
              <span className="meta-label">Preparation Time:</span>
              <span>{recipe.prepTime}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Cooking Time:</span>
              <span>{recipe.cookingTime}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Difficulty:</span>
              <span>{recipe.difficulty}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Servings:</span>
              <span>{recipe.servings}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipeGeneratorPage;