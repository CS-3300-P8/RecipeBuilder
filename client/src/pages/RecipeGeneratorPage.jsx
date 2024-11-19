import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function RecipeGeneratorPage() {
  const [currentPantry, setCurrentPantry] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dietaryRestrictions, setDietaryRestrictions] = useState('none');
  const [difficulty, setDifficulty] = useState('medium');

  useEffect(() => {
    // Fetch current pantry when component mounts
    fetchCurrentPantry();
  }, []);

  const fetchCurrentPantry = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/current_pantry');
      const data = await response.json();
      setCurrentPantry(data);
    } catch (error) {
      console.error('Error fetching pantry:', error);
    }
  };

  const generateRecipe = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: currentPantry?.ingredients || [],
          dietaryRestrictions,
          difficulty
        }),
      });
      
      const data = await response.json();
      setRecipe(data);
    } catch (error) {
      console.error('Error generating recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Recipe Generator</h1>
      
      {/* Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recipe Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <label className="block mb-2">Dietary Restrictions</label>
              <Select value={dietaryRestrictions} onValueChange={setDietaryRestrictions}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="gluten-free">Gluten-free</SelectItem>
                  <SelectItem value="dairy-free">Dairy-free</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block mb-2">Difficulty Level</label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={generateRecipe} 
              disabled={loading || !currentPantry}
              className="mt-4"
            >
              {loading ? 'Generating...' : 'Generate Recipe'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recipe Display */}
      {recipe && (
        <Card>
          <CardHeader>
            <CardTitle>{recipe.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {/* Ingredients List */}
              <div>
                <h3 className="font-bold mb-2">Ingredients</h3>
                <div className="grid gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-green-600">From Your Pantry:</h4>
                    <ul className="list-disc list-inside">
                      {recipe.availableIngredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-amber-600">Need to Purchase:</h4>
                    <ul className="list-disc list-inside">
                      {recipe.missingIngredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="font-bold mb-2">Instructions</h3>
                <ol className="list-decimal list-inside space-y-2">
                  {recipe.instructions.map((step, index) => (
                    <li key={index} className="ml-4">{step}</li>
                  ))}
                </ol>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Preparation Time:</span> {recipe.prepTime}
                </div>
                <div>
                  <span className="font-semibold">Cooking Time:</span> {recipe.cookingTime}
                </div>
                <div>
                  <span className="font-semibold">Difficulty:</span> {recipe.difficulty}
                </div>
                <div>
                  <span className="font-semibold">Servings:</span> {recipe.servings}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default RecipeGeneratorPage;