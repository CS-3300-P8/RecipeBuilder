import React, { useState, useEffect } from "react";
import { Button, Input, Select, Card, LoadingSpinner } from "../components/ui";

const VirtualPantry = () => {
  const [pantries, setPantries] = useState([]); // List of available pantries
  const [selectedPantry, setSelectedPantry] = useState(null); // Currently selected pantry
  const [ingredients, setIngredients] = useState([]); // Ingredients of the selected pantry
  const [newIngredientName, setNewIngredientName] = useState(""); // Input for new ingredient name
  const [newIngredientCategory, setNewIngredientCategory] = useState(""); // Input for new ingredient category
  const [newPantryName, setNewPantryName] = useState(""); // Input for new Pantry name
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
      if (!response.ok) {
        throw new Error("Failed to fetch ingredients");
      }
      const data = await response.json();
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

      if (!response2.ok) {
        throw new Error("Failed to update current pantry");
      }
    } catch (error) {
      console.error("Error fetching ingredients or updating current pantry:", error);
      setIngredients([]); // Reset ingredients in case of an error
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
  const handleCreatePantry = async () => {
    if (!newPantryName || !newPantryCategory) {
      alert("Please provide both name and category for the pantry.");
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

      // Update the pantry list with the new pantry
      setPantries((prevPantries) => [...prevPantries, newPantryName]);

      // Clear input fields
      setNewPantryName("");
      setNewPantryCategory("");

      console.log(`Pantry '${newPantryName}' added successfully.`);
    } catch (error) {
      console.error("Error adding Pantry:", error);
    }
  };

  return (
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
    </div>
  );
};

export default VirtualPantry;
