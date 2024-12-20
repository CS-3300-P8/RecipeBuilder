import React, { useState, useEffect } from "react";
import "./VirtualPantry.css";
import instance from "../utils/PantryMediator.js";

const VirtualPantry = () => {
  const [pantries, setPantries] = useState([]); // List of available pantries
  const [selectedPantry, setSelectedPantry] = useState(null); // Currently selected pantry
  const [ingredients, setIngredients] = useState([]); // Ingredients of the selected pantry
  const [newIngredientName, setNewIngredientName] = useState(""); // Input for new ingredient name
  const [newIngredientCategory, setNewIngredientCategory] = useState(""); // Input for new ingredient category
  const [newPantryName, setNewPantryName] = useState(""); // Input for new Pantry name

  // Fetch all pantries and current pantry on component mount
  useEffect(() => {
    const initializePantries = async () => {
      try {
        // Fetch all pantries
        setPantries(await instance.getPantryNames());

        // Fetch current pantry
        const currentPantryData = await instance.getCurrentPantry();

        if (currentPantryData.pantryName) {
          setSelectedPantry(currentPantryData.pantryName);
          setIngredients(currentPantryData.ingredients);
        }
      } catch (error) {
        console.error("Error initializing pantries:", error);
      }
    };

    initializePantries();
  }, []);

  const handlePantryChange = async (pantry) => {
    setSelectedPantry(pantry);

    try {
      // Fetch ingredients for the selected pantry
      setIngredients(await instance.getIngredients(pantry));

      // Update the current pantry on the backend
      await instance.setCurrentPantry(pantry);
    } catch (error) {
      console.error(
        "Error fetching ingredients or updating current pantry:",
        error
      );
      setIngredients([]);
    }
  };

  const handleDeleteIngredient = async (ingredientName) => {
    if (!selectedPantry) return;

    try {
      instance.deleteIngredient(selectedPantry, ingredientName);

      setIngredients((prevIngredients) =>
        prevIngredients.filter(
          (ingredient) => ingredient.name !== ingredientName
        )
      );
      console.log(`Ingredient '${ingredientName}' deleted successfully.`);
    } catch (error) {
      console.error("Error deleting ingredient:", error);
    }
  };

  const handleAddIngredient = async () => {
    if (!selectedPantry || !newIngredientName || !newIngredientCategory) {
      alert(
        "Please select a pantry and provide both name and category for the ingredient."
      );
      return;
    }

    try {
      await instance.addIngredient(selectedPantry, newIngredientName, newIngredientCategory);

      setIngredients((prevIngredients) => [
        ...prevIngredients,
        { name: newIngredientName, category: newIngredientCategory },
      ]);

      setNewIngredientName("");
      setNewIngredientCategory("");

      console.log(`Ingredient '${newIngredientName}' added successfully.`);
    } catch (error) {
      console.error("Error adding ingredient:", error);
    }
  };

  const handleAddPantry = async () => {
    if (!newPantryName) {
      alert("Please provide a pantry name.");
      return;
    }

    try {
      await instance.addPantry(newPantryName);

      setPantries((prevPantries) => [...prevPantries, newPantryName]);
      setNewPantryName("");
      console.log(`Pantry '${newPantryName}' added successfully.`);
    } catch (error) {
      console.error("Error adding Pantry:", error);
    }
  };

  const handleDeletePantry = async (pantryName) => {
    if (!pantryName) return;

    try {
      await instance.deletePantry(pantryName);

      setPantries((prevPantries) =>
        prevPantries.filter((pantry) => pantry !== pantryName)
      );

      if (selectedPantry === pantryName) {
        setSelectedPantry(null);
        setIngredients([]);
      }

      console.log(`Pantry '${pantryName}' deleted successfully.`);
    } catch (error) {
      console.error("Error deleting Pantry:", error);
    }
  };

  return (
    <div>
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
              {pantry} {pantry === selectedPantry ? "(Current)" : ""}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Create a New Pantry</h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
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
      </div>

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

      <div>
        <h2>
          {selectedPantry ? `${selectedPantry} Ingredients` : "Ingredients"}
        </h2>
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
        {/* Add a button to delete the selected pantry */}
        {selectedPantry && (
          <button
            onClick={() => handleDeletePantry(selectedPantry)}
            style={{
              backgroundColor: "orange",
              color: "white",
              padding: "5px 10px",
              border: "none",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Delete Pantry
          </button>
        )}
      </div>
    </div>
  );
};

export default VirtualPantry;
