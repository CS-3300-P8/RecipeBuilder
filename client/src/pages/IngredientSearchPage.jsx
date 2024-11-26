import React, { useState, useEffect } from "react";
import "./ingredientSearchPage.css";
import instance from "../utils/PantryMediator.js";

const IngredientSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPantry, setCurrentPantry] = useState(null);
  const [recentSearches, setRecentSearches] = useState([
    "Tomatoes",
    "Chicken",
    "Rice",
    "Eggs",
  ]);
  const [confirmationMessage, setConfirmationMessage] = useState(null);

  // Fetch current pantry on component mount
  useEffect(() => {
    fetchCurrentPantry();
  }, []);

  const fetchCurrentPantry = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/current_pantry");
      if (!response.ok) {
        if (response.status === 404) {
          setCurrentPantry(null);
          return;
        }
        throw new Error("Failed to fetch the current pantry");
      }
      const data = await response.json();
      setCurrentPantry({
        name: data.pantryName,
        ingredients: data.ingredients,
      });
    } catch (error) {
      console.error("Error fetching current pantry:", error);
      setCurrentPantry(null);
    }
  };

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

        await instance.addIngredient(currentPantry.name, item["name"], item["category"]);

        setConfirmationMessage(`${item.name} has been added to your pantry`);

          // Refresh the current pantry to get the updated ingredients
        await fetchCurrentPantry();

        setConfirmationMessage(
          `${item.name} has been added to ${currentPantry.name}`
        );
        setTimeout(() => {
          setConfirmationMessage(null);
        }, 3000);
      } catch (error) {
        console.error("Error adding item:", error);
      }
    };

    // Check if the ingredient is already in the current pantry
    const isIngredientInPantry = currentPantry?.ingredients?.some(
      (ingredient) => ingredient.name.toLowerCase() === item.name.toLowerCase()
    );

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
        {isIngredientInPantry ? (
          <span className="text-gray-500 italic">Already in pantry</span>
        ) : (
          <button className="add-button" onClick={handleAddItem}>
            Add
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="search-page">
      <div className="search-container">
        {/* Current Pantry Display */}
        <div className="current-pantry-status bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded mb-4">
          {/* <p className="text-lg">
            {currentPantry ? (
              <>
                Currently adding to: <strong>{currentPantry.name}</strong>
                <span className="text-sm ml-2">
                  ({currentPantry.ingredients.length} ingredients)
                </span>
              </>
            ) : (
              <span className="text-orange-600">
                No pantry selected. Please select a pantry first.
              </span>
            )}
          </p> */}
        </div>

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
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "1rem",
              color: "#1F2937",
            }}
          >Find Ingredients</h1>
          <p>Search for ingredients to add to your virtual pantry</p>
          <p className="text-lg">
            {currentPantry ? (
              <>
                Currently adding to: <strong>{currentPantry.name}</strong>
                <span className="text-sm ml-2">
                  ({currentPantry.ingredients.length} ingredients)
                </span>
              </>
            ) : (
              <span className="text-orange-600">
                No pantry selected. Please select a pantry first.
              </span>
            )}
          </p>
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
                {term}
              </span>
            ))}
          </div>
        </div>

        <div className="results-section">
          <h2>Results</h2>
          {isLoading ? (
            <div className="loading">Searching...</div>
          ) : searchResults.length > 0 ? (
            <div className="results-list">
              {searchResults.map((item, index) => (
                <ResultItem key={index} item={item} />
              ))}
            </div>
          ) : searchQuery ? (
            <p className="no-results">
              No ingredients found. Try another search term.
            </p>
          ) : (
            <p className="no-results">Start typing to search for ingredients</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientSearchPage;
