import React, { useState, useEffect } from "react";
import { Button, Input, Select, Card, LoadingSpinner } from "../components/ui";

const VirtualPantry = () => {
  const [pantries, setPantries] = useState([]); // List of available pantries
  const [selectedPantry, setSelectedPantry] = useState(null); // Currently selected pantry
  const [ingredients, setIngredients] = useState([]); // Ingredients of the selected pantry
  const [newIngredientName, setNewIngredientName] = useState(""); // Input for new ingredient name
  const [newIngredientCategory, setNewIngredientCategory] = useState(""); // Input for new ingredient category
  const [newPantryName, setNewPantryName] = useState(""); // Input for new Pantry name
<<<<<<< Updated upstream
  const [newPantryCategory, setNewPantryCategory] = useState(""); // Input for new Pantry category
  const [isLoading, setIsLoading] = useState(false);

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
    setSelectedPantry(pantry); // Update the selected pantry

    try {
      // Fetch ingredients for the selected pantry
      const response = await fetch(`http://localhost:3001/api/pantries/${encodeURIComponent(pantry)}`);
=======

  // Fetch all pantries and current pantry on component mount
  useEffect(() => {
    const initializePantries = async () => {
      try {
        // Fetch all pantries
        const pantriesResponse = await fetch(
          "http://localhost:3001/api/pantryNames"
        );
        if (!pantriesResponse.ok) {
          throw new Error("Failed to fetch pantries");
        }
        const pantriesData = await pantriesResponse.json();
        setPantries(pantriesData);

        // Fetch current pantry
        const currentPantryResponse = await fetch(
          "http://localhost:3001/api/current_pantry"
        );
        if (!currentPantryResponse.ok) {
          if (currentPantryResponse.status !== 404) {
            throw new Error("Failed to fetch current pantry");
          }
          return;
        }
        const currentPantryData = await currentPantryResponse.json();

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
      const response = await fetch(
        `http://localhost:3001/api/pantries/${encodeURIComponent(pantry)}`
      );
>>>>>>> Stashed changes
      if (!response.ok) {
        throw new Error("Failed to fetch ingredients");
      }
      const data = await response.json();
<<<<<<< Updated upstream
      setIngredients(data); // Set the ingredients of the selected pantry

      // Update the current pantry on the backend
      const response2 = await fetch(`http://localhost:3001/api/current_pantry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pantryName: pantry, // Use the updated pantry name here
        }),
      });
=======
      setIngredients(data);

      // Update the current pantry on the backend
      const response2 = await fetch(
        `http://localhost:3001/api/current_pantry`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pantryName: pantry,
          }),
        }
      );
>>>>>>> Stashed changes

      if (!response2.ok) {
        throw new Error("Failed to update current pantry");
      }
    } catch (error) {
<<<<<<< Updated upstream
      console.error("Error fetching ingredients or updating current pantry:", error);
      setIngredients([]); // Reset ingredients in case of an error
    }
  };

  // Delete an ingredient from the pantry
=======
      console.error(
        "Error fetching ingredients or updating current pantry:",
        error
      );
      setIngredients([]);
    }
  };

>>>>>>> Stashed changes
  const handleDeleteIngredient = async (ingredientName) => {
    if (!selectedPantry) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/pantries/${encodeURIComponent(
          selectedPantry
        )}/ingredients/${encodeURIComponent(ingredientName)}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete ingredient");
      }

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
      const response = await fetch(
        "http://localhost:3001/api/store_ingredient",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pantryName: selectedPantry,
            name: newIngredientName,
            category: newIngredientCategory,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add ingredient");
      }

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

<<<<<<< Updated upstream
  // Add a new pantry
  const handleCreatePantry = async () => {
    if (!newPantryName || !newPantryCategory) {
      alert("Please provide both name and category for the pantry.");
=======
  const handleAddPantry = async () => {
    if (!newPantryName) {
      alert("Please provide a pantry name.");
>>>>>>> Stashed changes
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
          pantryCategory: newPantryCategory,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add Pantry");
      }

      setPantries((prevPantries) => [...prevPantries, newPantryName]);
<<<<<<< Updated upstream

      // Clear input fields
      setNewPantryName("");
      setNewPantryCategory("");

=======
      setNewPantryName("");
>>>>>>> Stashed changes
      console.log(`Pantry '${newPantryName}' added successfully.`);
    } catch (error) {
      console.error("Error adding Pantry:", error);
    }
  };

  return (
<<<<<<< Updated upstream
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>Your Pantries</h2>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Input
                value={newPantryName}
                onChange={(e) => setNewPantryName(e.target.value)}
                placeholder="New Pantry Name"
              />
              <Input
                value={newPantryCategory}
                onChange={(e) => setNewPantryCategory(e.target.value)}
                placeholder="Pantry Category"
              />
              <Button
                onClick={handleCreatePantry}
                disabled={!newPantryName || !newPantryCategory}
              >
                Create Pantry
              </Button>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {pantries.map((pantry) => (
                <Button
                  key={pantry}
                  variant={selectedPantry === pantry ? 'primary' : 'secondary'}
                  onClick={() => handlePantryChange(pantry)}
                >
                  {pantry}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {selectedPantry && (
        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
            Ingredients in {selectedPantry}
          </h2>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Input
                  value={newIngredientName}
                  onChange={(e) => setNewIngredientName(e.target.value)}
                  placeholder="Ingredient Name"
                />
                <Input
                  value={newIngredientCategory}
                  onChange={(e) => setNewIngredientCategory(e.target.value)}
                  placeholder="Ingredient Category"
                />
                <Button
                  onClick={handleAddIngredient}
                  disabled={!newIngredientName || !newIngredientCategory}
                >
                  Add Ingredient
                </Button>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '1rem' 
              }}>
                {ingredients.map((ingredient) => (
                  <Card key={ingredient.name} padding="0.75rem">
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      color: '#333'
                    }}>
                      <div>
                        <h3 style={{ fontWeight: '500' }}>{ingredient.name}</h3>
                        <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                          {ingredient.category}
                        </p>
                      </div>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteIngredient(ingredient.name)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </section>
      )}

      {isLoading && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          padding: '2rem' 
        }}>
          <LoadingSpinner />
        </div>
      )}
=======
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
        <h3 style={{ color: "#333" }}>Create a New Pantry</h3>
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
      </div>
>>>>>>> Stashed changes
    </div>
  );
};

export default VirtualPantry;
