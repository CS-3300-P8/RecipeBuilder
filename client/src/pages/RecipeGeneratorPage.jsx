import React, { useState, useEffect } from 'react';
import './RecipeGeneratorPage.css';

function RecipeGeneratorPage() {
  const [currentPantry, setCurrentPantry] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dietaryRestrictions, setDietaryRestrictions] = useState('none');
  const [difficulty, setDifficulty] = useState('medium');

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

  const generateRecipe = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!currentPantry?.ingredients) {
        throw new Error('No ingredients available in pantry');
      }

      const response = await fetch('http://localhost:3001/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: currentPantry.ingredients.map(ing => ing.name),
          dietaryRestrictions,
          difficulty
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipe');
      }

      const data = await response.json();
      
      // Validate the recipe data structure
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
      typeof data.difficulty === 'string' &&
      typeof data.servings === 'string';
  };

  return (
    <div className="recipe-container">
      <h1 className="recipe-title">Recipe Generator</h1>
      
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
                    <li key={`missing-${index}`}>{ingredient}</li>
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