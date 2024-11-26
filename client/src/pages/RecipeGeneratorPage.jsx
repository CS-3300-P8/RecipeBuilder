import React, { useState, useEffect } from "react";
import { Button, Input, Select, Card, LoadingSpinner } from "../components/ui";

function RecipeGeneratorPage() {
  const [currentPantry, setCurrentPantry] = useState(null);
  const [pantryName, setPantryName] = useState("");
  const [pantries, setPantries] = useState([]);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dietaryRestrictions, setDietaryRestrictions] = useState("none");
  const [difficulty, setDifficulty] = useState("medium");
  const [style, setStyle] = useState("American");
  const [types, setTypes] = useState("Dinner");
  const [addedIngredients, setAddedIngredients] = useState(new Set());

  useEffect(() => {
    fetchCurrentPantry();
    fetchPantries();
  }, []);

  const fetchCurrentPantry = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/current_pantry");
      if (!response.ok) {
        if (response.status === 404) {
          setCurrentPantry(null);
          setPantryName("");
          return;
        }
        throw new Error("Failed to fetch pantry data");
      }
      const data = await response.json();
      setCurrentPantry(data);
      setPantryName(data.pantryName); // Change this line from data.name to data.pantryName
    } catch (error) {
      console.error("Error fetching pantry:", error);
      setError("Failed to load pantry data. Please try again.");
    }
  };

  // Update the Select component options to show which pantry is current:
  <Select
    value={pantryName}
    onChange={(e) => {
      const value = e.target.value;
      console.log("Selected pantry:", value);
      switchPantry(value);
    }}
    options={[
      { value: "", label: "Choose a pantry" },
      ...pantries.map((pantry) => ({
        value: pantry,
        label: `${pantry}${
          pantry === currentPantry?.pantryName ? " (Current)" : ""
        }`,
      })),
    ]}
  />;
  {
    currentPantry && (
      <div
        style={{
          marginTop: "0.5rem",
          fontSize: "0.875rem",
          color: "#6B7280",
        }}
      >
        Available ingredients: {currentPantry.ingredients.length}
      </div>
    );
  }

  const fetchPantries = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/pantryNames");
      if (!response.ok) {
        throw new Error("Failed to fetch pantries");
      }
      const data = await response.json();
      setPantries(data);
    } catch (error) {
      console.error("Error fetching pantries:", error);
    }
  };

  const switchPantry = async (pantry) => {
    console.log("Switching to pantry:", pantry);
    setPantryName(pantry);

    try {
      const response = await fetch(`http://localhost:3001/api/current_pantry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pantryName: pantry,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update current pantry");
        setPantryName("");
      }

      const response2 = await fetch("http://localhost:3001/api/current_pantry");
      if (!response2.ok) {
        throw new Error("Failed to fetch pantry data");
      }
      const data = await response2.json();
      setCurrentPantry(data);
    } catch (error) {
      console.error("Error updating current pantry:", error);
      setPantryName("");
      setError("Failed to update pantry. Please try again.");
    }
  };

  // Modify the addToPantry function
  const addToPantry = async (ingredient) => {
    try {
      let curr_pantry = await fetch("http://localhost:3001/api/current_pantry");
      if (!curr_pantry.ok) {
        throw new Error("Failed to fetch current pantry");
      }

      let { pantryName } = await curr_pantry.json();

      if (!pantryName) {
        alert("No current Pantry set.");
        return;
      }

      let rsp = await fetch("http://localhost:3001/api/store_ingredient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pantryName,
          name: ingredient,
          category: ingredient,
        }),
      });

      if (rsp.ok) {
        // Add ingredient to the set of added ingredients
        setAddedIngredients((prev) => new Set([...prev, ingredient]));
      } else {
        console.error(`Failed to add ingredient: ${ingredient}.`);
      }
    } catch (error) {
      console.error("Error adding ingredient:", error);
    }
  };

  // Helper function to validate recipe data structure
  const isValidRecipeData = (data) => {
    return (
      data &&
      Array.isArray(data.availableIngredients) &&
      Array.isArray(data.missingIngredients) &&
      Array.isArray(data.instructions) &&
      typeof data.name === "string" &&
      typeof data.prepTime === "string" &&
      typeof data.cookingTime === "string" &&
      typeof data.style === "string" &&
      typeof data.types === "string" &&
      typeof data.difficulty === "string" &&
      typeof data.servings === "string"
    );
  };

  const generateRecipe = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(currentPantry);

      if (!currentPantry?.ingredients || currentPantry.ingredients.length < 1) {
        throw new Error("No ingredients available in pantry");
      }
      console.log(currentPantry.ingredients);
      console.log(dietaryRestrictions);
      console.log(style);
      console.log(types);
      console.log(difficulty);

      const response = await fetch(
        "http://localhost:3001/api/generate-recipe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ingredients: currentPantry.ingredients.map((ing) => ing.name),
            dietaryRestrictions,
            style,
            types,
            difficulty,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate recipe");
      }

      const data = await response.json();
      console.log("Generated recipe:", data);

      if (!isValidRecipeData(data)) {
        throw new Error("Invalid recipe data received");
      }

      setRecipe(data);
    } catch (error) {
      console.error("Error generating recipe:", error);
      setError(error.message || "Failed to generate recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        color: "#333",
      }}
    >
      <section>
        <Card>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1rem",
            color: "#1F2937",
            textAlign: "center",
          }}
        >
          Recipe Generator
        </h1>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#4B5563",
                }}
              >
                Select Pantry
              </label>
              <Select
                value={pantryName}
                onChange={(e) => {
                  const value = e.target.value;
                  console.log("Selected pantry:", value);
                  switchPantry(value);
                }}
                options={[
                  { value: "", label: "Choose a pantry" },
                  ...pantries.map((pantry) => ({
                    value: pantry,
                    label: pantry,
                  })),
                ]}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#4B5563",
                  }}
                >
                  Dietary Restrictions
                </label>
                <Select
                  value={dietaryRestrictions}
                  onChange={(e) => {
                    console.log(
                      "Selected dietary restriction:",
                      e.target.value
                    );
                    setDietaryRestrictions(e.target.value);
                  }}
                  options={[
                    { value: "none", label: "None" },
                    { value: "vegetarian", label: "Vegetarian" },
                    { value: "vegan", label: "Vegan" },
                    { value: "gluten-free", label: "Gluten Free" },
                  ]}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#4B5563",
                  }}
                >
                  Difficulty Level
                </label>
                <Select
                  value={difficulty}
                  onChange={(e) => {
                    console.log("Selected difficulty:", e.target.value);
                    setDifficulty(e.target.value);
                  }}
                  options={[
                    { value: "easy", label: "Easy" },
                    { value: "medium", label: "Medium" },
                    { value: "hard", label: "Hard" },
                  ]}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#4B5563",
                  }}
                >
                  Cuisine Style
                </label>
                <Select
                  value={style}
                  onChange={(e) => {
                    console.log("Selected style:", e.target.value);
                    setStyle(e.target.value);
                  }}
                  options={[
                    { value: "American", label: "American" },
                    { value: "Italian", label: "Italian" },
                    { value: "Mexican", label: "Mexican" },
                    { value: "Asian", label: "Asian" },
                    { value: "Mediterranean", label: "Mediterranean" },
                  ]}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#4B5563",
                  }}
                >
                  Meal Type
                </label>
                <Select
                  value={types}
                  onChange={(e) => {
                    console.log("Selected meal type:", e.target.value);
                    setTypes(e.target.value);
                  }}
                  options={[
                    { value: "Breakfast", label: "Breakfast" },
                    { value: "Lunch", label: "Lunch" },
                    { value: "Dinner", label: "Dinner" },
                    { value: "Snack", label: "Snack" },
                    { value: "Dessert", label: "Dessert" },
                  ]}
                />
              </div>
            </div>

            <Button onClick={generateRecipe} disabled={!pantryName || loading}>
              {loading ? "Generating Recipe..." : "Generate Recipe"}
            </Button>
          </div>
        </Card>
      </section>

      {error && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#FEE2E2",
            color: "#DC2626",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "2rem" }}
        >
          <LoadingSpinner />
        </div>
      ) : (
        recipe && (
          <section>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                marginBottom: "1rem",
                color: "#1F2937",
              }}
            >
              Generated Recipe
            </h2>
            <Card>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      color: "#1F2937",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {recipe.name}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      color: "#6B7280",
                      fontSize: "0.875rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <span> Prep: {recipe.prepTime}</span>
                    <span> Cook: {recipe.cookingTime}</span>
                    <span> {recipe.servings} servings</span>
                    <span>
                      {" "}
                      Difficulty:{" "}
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </span>
                  </div>
                </div>

                <div>
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#4B5563",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Missing Ingredients
                  </h4>
                  {recipe.missingIngredients &&
                  recipe.missingIngredients.length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      {recipe.missingIngredients.map((ingredient, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.5rem",
                            backgroundColor: "#F3F4F6",
                            borderRadius: "0.375rem",
                          }}
                        >
                          <span style={{ color: "#4B5563" }}>{ingredient}</span>
                          {/* REPLACE THIS EXISTING BUTTON */}
                          <Button
                            variant="secondary"
                            onClick={() => addToPantry(ingredient)}
                          >
                            {addedIngredients.has(ingredient)
                              ? "Added ✓"
                              : "Add to Pantry"}
                          </Button>
                          {/* END OF REPLACEMENT */}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "#6B7280" }}>
                      You have all the ingredients needed!
                    </p>
                  )}
                </div>

                <div>
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#4B5563",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Available Ingredients
                  </h4>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      color: "#333",
                    }}
                  >
                    {recipe.availableIngredients.map((ingredient, index) => (
                      <li
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.5rem",
                          backgroundColor: "#F9FAFB",
                          borderRadius: "0.25rem",
                        }}
                      >
                        <span style={{ color: "#F97316" }}>•</span>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#4B5563",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Instructions
                  </h4>
                  <ol
                    style={{
                      paddingLeft: "1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                      color: "#333",
                    }}
                  >
                    {recipe.instructions.map((step, index) => (
                      <li
                        key={index}
                        style={{
                          paddingLeft: "0.5rem",
                          lineHeight: "1.5",
                        }}
                      >
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </Card>
          </section>
        )
      )}
    </div>
  );
}

export default RecipeGeneratorPage;
