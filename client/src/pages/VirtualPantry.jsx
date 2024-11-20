import React, { useState, useEffect } from "react";
import "./VirtualPantry.css";

const VirtualPantry = () => {
  const [pantries, setPantries] = useState([]); // List of available pantries
  const [selectedPantry, setSelectedPantry] = useState(""); // Currently selected pantry
  const [ingredients, setIngredients] = useState([]); // Ingredients of the selected pantry
  const [newIngredientName, setNewIngredientName] = useState(""); // Input for new ingredient name
  const [newIngredientCategory, setNewIngredientCategory] = useState(""); // Input for new ingredient category
  const [newPantryName, setNewPantryName] = useState(""); // Input for new Pantry name
  const [error, setError] = useState(""); // Error state

  // Fetch all pantries from the backend
  useEffect(() => {
    const fetchPantries = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/pantryNames");
        if (!response.ok) {
          throw new Error("Failed to fetch pantries");
        }
        const data = await response.json();
        setPantries(data.pantries || []); // Ensure we have an array
      } catch (error) {
        console.error("Error fetching pantries:", error);
        setError("Failed to fetch pantries");
        setPantries([]); // Reset to empty array on error
      }
    };

    fetchPantries();
  }, []);

  // Fetch ingredients of the selected pantry
  const handlePantryChange = async (pantry) => {
    setSelectedPantry(pantry);
    setError(""); // Clear any previous errors
    if (!pantry) return;

    try {
      const response = await fetch(`http://localhost:3001/api/pantries/${encodeURIComponent(pantry)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch ingredients");
      }
      const data = await response.json();
      setIngredients(data.ingredients || []); // Ensure we have an array

      // Update the current pantry on the backend
      const response2 = await fetch(`http://localhost:3001/api/current_pantry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pantryName: pantry,
        }),
      });

      if (!response2.ok) {
        throw new Error("Failed to update current pantry");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch ingredients or update current pantry");
      setIngredients([]); // Reset ingredients on error
    }
  };

  // Delete an ingredient from the pantry
  const handleDeleteIngredient = async (ingredientName) => {
    if (!selectedPantry) {
      setError("Please select a pantry first");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/pantries/${encodeURIComponent(selectedPantry)}/ingredients/${encodeURIComponent(ingredientName)}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete ingredient");
      }

      setIngredients((prevIngredients) =>
        prevIngredients.filter((ingredient) => ingredient.name !== ingredientName)
      );
      setError(""); // Clear any previous errors
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to delete ingredient");
    }
  };

  // Add a new ingredient to the selected pantry
  const handleAddIngredient = async () => {
    if (!selectedPantry) {
      setError("Please select a pantry first");
      return;
    }

    if (!newIngredientName || !newIngredientCategory) {
      setError("Please provide both name and category for the ingredient");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/store_ingredient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pantryName: selectedPantry,
          name: newIngredientName,
          category: newIngredientCategory,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add ingredient");
      }

      setIngredients((prevIngredients) => [
        ...prevIngredients,
        { name: newIngredientName, category: newIngredientCategory },
      ]);

      setNewIngredientName("");
      setNewIngredientCategory("");
      setError(""); // Clear any previous errors
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to add ingredient");
    }
  };

  // Add a new pantry
  const handleAddPantry = async () => {
    if (!newPantryName) {
      setError("Please provide a pantry name");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/create_pantry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pantryName: newPantryName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add Pantry");
      }

      setPantries((prevPantries) => [...prevPantries, newPantryName]);
      setNewPantryName("");
      setError(""); // Clear any previous errors
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to create pantry");
    }
  };

  return (
    <div className="virtual-pantry">
      <h1>Pantry Page</h1>

      {error && <div className="error-message" role="alert">{error}</div>}

      {/* Dropdown for selecting a pantry */}
      <div className="pantry-select">
        <label htmlFor="pantry-select">Select a Pantry:</label>
        <select
          id="pantry-select"
          data-testid="pantry-select"
          onChange={(e) => handlePantryChange(e.target.value)}
          value={selectedPantry}
        >
          <option value="">Choose a pantry</option>
          {Array.isArray(pantries) && pantries.map((pantry, index) => (
            <option key={index} value={pantry}>
              {pantry}
            </option>
          ))}
        </select>
      </div>

      {/* Create new pantry section */}
      <div className="create-pantry">
        <h3>Create a New Pantry</h3>
        <div className="input-group">
          <input
            type="text"
            placeholder="Pantry Name"
            value={newPantryName}
            data-testid="new-pantry-input"
            onChange={(e) => setNewPantryName(e.target.value)}
          />
          <button data-testid="create-pantry-button" onClick={handleAddPantry}>Create Pantry</button>
        </div>
      </div>

      {/* Add new ingredient section */}
      {selectedPantry && (
        <div className="add-ingredient">
          <h3>Add New Ingredient</h3>
          <div className="input-group">
            <input
              type="text"
              placeholder="Ingredient Name"
              value={newIngredientName}
              data-testid="ingredient-name-input"
              onChange={(e) => setNewIngredientName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Category"
              value={newIngredientCategory}
              data-testid="ingredient-category-input"
              onChange={(e) => setNewIngredientCategory(e.target.value)}
            />
            <button data-testid="add-ingredient-button" onClick={handleAddIngredient}>Add Ingredient</button>
          </div>
        </div>
      )}

      {/* Display ingredients */}
      {selectedPantry && ingredients.length > 0 && (
        <div className="ingredients-list">
          <h3>Ingredients in {selectedPantry}</h3>
          <div className="ingredients-grid">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-item">
                <span>{ingredient.name} ({ingredient.category})</span>
                <button
                  data-testid={`delete-ingredient-${index}`}
                  onClick={() => handleDeleteIngredient(ingredient.name)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualPantry;
