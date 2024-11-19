import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import IngredientSearchPage from "./pages/IngredientSearchPage.jsx";
import VirtualPantry from "./pages/VirtualPantry.jsx";
import RecipeGeneratorPage from "./pages/RecipeGeneratorPage.jsx";

function App() {
  return (
    <Router>
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
          <Link to="/" style={{ textDecoration: "none", color: "blue" }}>
            Virtual Pantry
          </Link>
          <Link to="/ingredient-search" style={{ textDecoration: "none", color: "blue" }}>
            Ingredient Search
          </Link>
        </nav>

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<VirtualPantry />} />
          <Route path="/ingredient-search" element={<IngredientSearchPage />} />
          <Route path="/recipe-generator" element={<RecipeGeneratorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
