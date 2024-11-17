import React, { useState, useEffect } from "react";
import "./VirtualPantry.css";

const VirtualPantry = () => {
  const [pantries, setPantries] = useState([]); // List of available pantries
  const [selectedPantry, setSelectedPantry] = useState(null); // Currently selected pantry
  const [ingredients, setIngredients] = useState([]); // Ingredients of the selected pantry

// Fetch all pantries from the backend
useEffect(() => {
  const fetchPantries = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/pantryNames");
      if (!response.ok) {
        throw new Error("Failed to fetch pantries");
      }
      const data = await response.json();
      setPantries(data); // Set the pantry names
    } catch (error) {
      console.error("Error fetching pantries:", error);
    }
  };

  fetchPantries();
}, []);

// Fetch ingredients of the selected pantry
const handlePantryChange = async (pantry) => {
  setSelectedPantry(pantry);

  try {
    const response = await fetch(`http://localhost:3001/api/pantries/${encodeURIComponent(pantry)}`);
    if (!response.ok) {
      throw new Error("Failed to fetch ingredients");
    }
    const data = await response.json();
    setIngredients(data); // Set the ingredients of the selected pantry
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    setIngredients([]);
  }
};

  // Delete an ingredient from the pantry
  const handleDeleteIngredient = async (ingredientName) => {
    if (!selectedPantry) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/pantries/${encodeURIComponent(selectedPantry)}/ingredients/${encodeURIComponent(ingredientName)}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete ingredient");
      }

      // Remove the ingredient locally after successful deletion
      setIngredients((prevIngredients) =>
        prevIngredients.filter((ingredient) => ingredient.name !== ingredientName)
      );
      console.log(`Ingredient '${ingredientName}' deleted successfully.`);
    } catch (error) {
      console.error("Error deleting ingredient:", error);
    }
  };

return (
  <div>
    <h1>Pantry Page</h1>

    {/* Dropdown for selecting a pantry */}
    <div>
      <label htmlFor="pantry-select">Select a Pantry:</label>
      <select
        id="pantry-select"
        onChange={(e) => handlePantryChange(e.target.value)}
        value={selectedPantry || ""}
      >
        <option value="" disabled>
          Choose a pantry
        </option>
        {pantries.map((pantry, index) => (
          <option key={index} value={pantry}>
            {pantry}
          </option>
        ))}
      </select>
    </div>

    {/* Display ingredients of the selected pantry */}
    <div>
      <h2>{selectedPantry ? `${selectedPantry} Ingredients` : "Ingredients"}</h2>
      {selectedPantry ? (
        <ul>
          {ingredients.length > 0 ? (
              ingredients.map((ingredient, index) => (
                <li key={index}>
                  {`${ingredient.name} (${ingredient.category})`}
                  <button
                    onClick={() => handleDeleteIngredient(ingredient.name)}
                    style={{
                      marginLeft: "10px",
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      padding: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))
            ) : (
              <p>No ingredients found.</p>
            )}
          </ul>
        ) : (
          <p>Please select a pantry to view its ingredients.</p>
        )}
      </div>
    </div>
  );
};
export default VirtualPantry;
