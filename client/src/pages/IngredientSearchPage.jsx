import React, { useState } from "react";
import { Button, Input, Card, LoadingSpinner } from "../components/ui";
import "./ingredientSearchPage.css";

const IngredientSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    "Tomatoes",
    "Chicken",
    "Rice",
    "Eggs",
  ]);
  const [confirmationMessage, setConfirmationMessage] = useState(null);

  const normalizeIngredient = async (query) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/normalizeIngredient/${query}`
      );
      if (!response.ok) {
        throw new Error("Failed to normalize ingredient");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const normalizedData = await normalizeIngredient(query);

      if (!normalizedData || !normalizedData.normalizedName) {
        throw new Error("Invalid response from API");
      }

      const results = [
        {
          name: normalizedData.normalizedName,
          category: normalizedData.category,
          isMain: true,
        },
        ...normalizedData.similarIngredients.map((ingredient) => ({
          name: ingredient,
          category: normalizedData.category,
          isRecommendation: true,
        })),
      ];

      setSearchResults(results);

      if (!recentSearches.includes(normalizedData.normalizedName)) {
        setRecentSearches((prev) =>
          [normalizedData.normalizedName, ...prev].slice(0, 5)
        );
        localStorage.setItem(
          "recentSearches",
          JSON.stringify(
            [normalizedData.normalizedName, ...recentSearches].slice(0, 5)
          )
        );
      }
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([
        {
          name: query,
          category: "Unknown",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const ResultItem = ({ item }) => {
    const handleAddItem = async () => {
      try {
        const responseCurrentPantry = await fetch(
          "http://localhost:3001/api/current_pantry"
        );
        if (!responseCurrentPantry.ok) {
          throw new Error("Failed to fetch the current pantry");
        }

        const { pantryName } = await responseCurrentPantry.json();

        if (!pantryName) {
          alert("No current pantry is set. Please select a pantry first.");
          return;
        }

        const response = await fetch(
          "http://localhost:3001/api/store_ingredient",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pantryName,
              name: item.name,
              category: item.category,
            }),
          }
        );

        if (response.ok) {
          // Show confirmation message
          setConfirmationMessage(`${item.name} has been added to your pantry`);

          // Clear the message after 3 seconds
          setTimeout(() => {
            setConfirmationMessage(null);
          }, 10000);
        } else {
          console.error("Failed to save item.");
        }
      } catch (error) {
        console.error("Error adding item:", error);
      }
    };

    return (
      <div
        className={`result-item ${item.isMain ? "main-result" : ""} ${
          item.isRecommendation ? "recommendation" : ""
        }`}
      >
        <div>
          <h3>{item.name}</h3>
          <p>{item.category}</p>
          {item.isRecommendation && (
            <span className="recommendation-tag">Similar ingredient</span>
          )}
        </div>
        <button className="add-button" onClick={handleAddItem}>
          Add
        </button>
      </div>
    );
  };

  return (
    <div className="search-page">
      <div className="search-container">
        {confirmationMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Success! </strong>
            <span className="block sm:inline">{confirmationMessage}</span>
          </div>
        )}

        <div className="search-header">
          <h1>Find Ingredients</h1>
          <p>Search for ingredients to add to your virtual pantry</p>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && handleSearch(searchQuery)}
          />
          <button
            onClick={() => handleSearch(searchQuery)}
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>

        <div className="recent-searches">
          <h2>Recent Searches</h2>
          <div className="tags">
            {recentSearches.map((term, index) => (
              <span
                key={index}
                className="tag"
                onClick={() => {
                  setSearchQuery(term);
                  handleSearch(term);
                }}
                
              >
                Search
              </Button>
            </div>

            {recentSearches.length > 0 && (
              <div>
                <h3 style={{ 
                  fontSize: '0.875rem', 
                  color: '#6B7280', 
                  marginBottom: '0.5rem' 
                }}>
                  Recent Searches
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {recentSearches.map((term) => (
                    <Button
                      key={term}
                      variant="secondary"
                      onClick={() => {
                        setSearchQuery(term);
                        handleSearch(term);
                      }}
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </section>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <LoadingSpinner />
        </div>
      ) : searchResults.length > 0 && (
        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
            Search Results
          </h2>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            {searchResults.map((result) => (
              <Card key={result.name} padding="1rem">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <h3 style={{ 
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#333' // Ingredient text color
                  }}>
                    {result.isMain && (
                      <span style={{ 
                        backgroundColor: '#FEF3C7', 
                        color: '#D97706',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem'
                      }}>
                        Main Result
                      </span>
                    )}
                    {result.name}
                  </h3>
                  <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                    Category: {result.category}
                  </p>
                  {result.isRecommendation && (
                    <p style={{ 
                      color: '#059669',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      ✨ Similar Ingredient
                    </p>
                  )}
                  <Button
                    variant="secondary"
                    onClick={() => handleAddToPantry(result)}
                  >
                    Add to Pantry
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default IngredientSearchPage;
