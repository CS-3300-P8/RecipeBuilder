import React, { useState, useEffect } from "react";
import "./VirtualPantry.css";

const VirtualPantry = () => {
  const [pantries, setPantries] = useState([]); // List of available pantries
  const [selectedPantry, setSelectedPantry] = useState(null); // Currently selected pantry
  const [ingredients, setIngredients] = useState([]); // Ingredients of the selected pantry
  const [newIngredientName, setNewIngredientName] = useState(""); // Input for new ingredient name
  const [newIngredientCategory, setNewIngredientCategory] = useState(""); // Input for new ingredient category
  const [newPantryName, setNewPantryName] = useState(""); // Input for new Pantry name
  const [newPantryCategory, setNewPantryCategory] = useState(""); // Input for new Pantry category


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

  // Add a new ingredient to the selected pantry
  const handleAddIngredient = async () => {
    if (!selectedPantry || !newIngredientName || !newIngredientCategory) {
      alert("Please select a pantry and provide both name and category for the ingredient.");
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

      // Update the local ingredient list with the new ingredient
      setIngredients((prevIngredients) => [
        ...prevIngredients,
        { name: newIngredientName, category: newIngredientCategory },
      ]);

      // Clear input fields
      setNewIngredientName("");
      setNewIngredientCategory("");

      console.log(`Ingredient '${newIngredientName}' added successfully.`);
    } catch (error) {
      console.error("Error adding ingredient:", error);
    }
  };

  // Add a new pantry
  const handleAddPantry = async () => {
    if (!newPantryName) {
      alert("Please select a pantry and provide both name.");
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

      // Update the pantry list with the new pantry
      setPantries((prevPantries) => [...prevPantries, newPantryName]);


      // Clear input fields
      setNewPantryName("");

      console.log(`Pantry '${newPantryName}' added successfully.`);
    } catch (error) {
      console.error("Error adding Pantry:", error);
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

    {/* Input fields and button for adding a Pantry */}
    <div style={{ marginTop: "20px" }}>
      <h3 style={{ color: "#333" }}>Create a New Pantry</h3>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Pantry Name"
          value={newPantryName}
          onChange={(e) => setNewPantryName(e.target.value)}
          style={{
            flex: "1",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        />
        <button
          onClick={handleAddPantry}
          style={{
            backgroundColor: newPantryName ? "blue" : "gray",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "4px",
            fontSize: "14px",
            cursor: newPantryName ? "pointer" : "not-allowed",
          }}
          disabled={!newPantryName}
        >
          Create Pantry
        </button>
      </div>
      {!newPantryName && (
        <p style={{ color: "red", fontSize: "12px" }}>
          Please provide a name for the new pantry.
        </p>
      )}
    </div>


    {/* Input fields and button for adding an ingredient */}
    {selectedPantry && (
      <div>
        <h3>Add an Ingredient to {selectedPantry}</h3>
        <input
          type="text"
          placeholder="Ingredient Name"
          value={newIngredientName}
          onChange={(e) => setNewIngredientName(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <input
          type="text"
          placeholder="Category"
          value={newIngredientCategory}
          onChange={(e) => setNewIngredientCategory(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button
          onClick={handleAddIngredient}
          style={{
            backgroundColor: "green",
            color: "white",
            padding: "5px 10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add Ingredient
        </button>
      </div>
    )}

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
