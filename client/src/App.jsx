import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import IngredientSearchPage from "./pages/IngredientSearchPage.jsx";
import VirtualPantry from "./pages/VirtualPantry.jsx";
import RecipeGeneratorPage from "./pages/RecipeGeneratorPage.jsx";

function NavLink({ to, children, theme }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      style={{
        color: isActive ? (theme === "dark" ? '#FBBF24' : '#F97316') : (theme === "dark" ? '#D1D5DB' : '#4B5563'),
        textDecoration: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        fontWeight: '500',
        backgroundColor: isActive ? (theme === "dark" ? '#1F2937' : '#FFF7ED') : 'transparent',
        transition: 'all 0.2s ease-in-out',
      }}
    >
      {children}
    </Link>
  );
}

function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.style.backgroundColor = theme === "dark" ? "#1A202C" : "#F9FAFB";
    document.body.style.color = theme === "dark" ? "#E5E7EB" : "#1F2937";
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <Router>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem',
      }}>
        <header style={{
          marginBottom: '2rem',
          borderBottom: `1px solid ${theme === "dark" ? '#374151' : '#E5E7EB'}`,
          paddingBottom: '1rem',
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <span style={{ color: theme === "dark" ? '#FBBF24' : '#F97316' }}>🍳</span>
            Recipe Builder
          </h1>
          
          <nav style={{
            display: "flex",
            gap: '1rem',
            alignItems: 'center',
          }}>
            <NavLink to="/" theme={theme}>Virtual Pantry</NavLink>
            <NavLink to="/ingredient-search" theme={theme}>Ingredient Search</NavLink>
            <NavLink to="/generate-recipe" theme={theme}>Generate Recipe</NavLink>
          </nav>

          <button
            onClick={toggleTheme}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: theme === "dark" ? '#374151' : '#F3F4F6',
              color: theme === "dark" ? '#E5E7EB' : '#1F2937',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            Toggle {theme === "dark" ? "Light" : "Dark"} Mode
          </button>
        </header>

        <main style={{
          background: theme === "dark" ? '#2D3748' : 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: theme === "dark"
            ? '0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.4)'
            : '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        }}>
          <Routes>
            <Route path="/" element={<VirtualPantry />} />
            <Route path="/ingredient-search" element={<IngredientSearchPage />} />
            <Route path="/generate-recipe" element={<RecipeGeneratorPage />} />
          </Routes>
        </main>
        <footer style={{
          marginTop: '2rem',
          textAlign: 'center',
          padding: '1rem 0',
          fontSize: '0.875rem',
          color: '#9CA3AF',
        }}>
          © {new Date().getFullYear()} Recipe Builder. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}

export default App;
