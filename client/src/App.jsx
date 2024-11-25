import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import IngredientSearchPage from "./pages/IngredientSearchPage.jsx";
import VirtualPantry from "./pages/VirtualPantry.jsx";
import RecipeGeneratorPage from "./pages/RecipeGeneratorPage.jsx";

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      style={{
        color: isActive ? '#F97316' : '#4B5563',
        textDecoration: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        fontWeight: '500',
        backgroundColor: isActive ? '#FFF7ED' : 'transparent',
        transition: 'all 0.2s ease-in-out',
      }}
    >
      {children}
    </Link>
  );
}

function App() {
  return (
    <Router>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem',
      }}>
        <header style={{
          marginBottom: '2rem',
          borderBottom: '1px solid #E5E7EB',
          paddingBottom: '1rem',
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#fdfbfa',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <span style={{ color: '#F97316' }}>🍳</span>
            Recipe Builder
          </h1>
          
          <nav style={{
            display: "flex",
            gap: '1rem',
            alignItems: 'center',
          }}>
            <NavLink to="/">Virtual Pantry</NavLink>
            <NavLink to="/ingredient-search">Ingredient Search</NavLink>
            <NavLink to="/generate-recipe">Generate Recipe</NavLink>
          </nav>
        </header>

        <main style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        }}>
          <Routes>
            <Route path="/" element={<VirtualPantry />} />
            <Route path="/ingredient-search" element={<IngredientSearchPage />} />
            <Route path="/generate-recipe" element={<RecipeGeneratorPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
