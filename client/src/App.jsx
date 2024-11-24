import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import IngredientSearchPage from "./pages/IngredientSearchPage.jsx";
import VirtualPantry from "./pages/VirtualPantry.jsx";
import RecipeGeneratorPage from "./pages/RecipeGeneratorPage.jsx";

function App() {
  return (
    <Router>
      <h1>Recipe Builder</h1>
      <div>
        {/* Navigation Menu */}
        <nav
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "10px",
            backgroundColor: "#f4f4f4",
            borderBottom: "1px solid #ddd",
          }}
        >
          <Link to="/">
            Virtual Pantry
          </Link>
          <Link to="/ingredient-search">
            Ingredient Search
          </Link>
          <Link to="/generate-recipe">
            Generate Recipe
          </Link>
        </nav>

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<VirtualPantry />} />
          <Route path="/ingredient-search" element={<IngredientSearchPage />} />
          <Route path="/generate-recipe" element={<RecipeGeneratorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
