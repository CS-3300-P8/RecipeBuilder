// IngredientSearchPage.jsx
import React, { useState } from "react";
import OpenAI from "openai";
import "./ingredientSearchPage.css";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

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

  const normalizeIngredient = async (query) => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that normalizes ingredient names and provides category information. 
            For the given ingredient, provide:
            1. The normalized ingredient name
            2. Its category (e.g., Vegetables, Fruits, Proteins, Dairy, etc.)
            3. 2-3 similar ingredients
            
            Format your response as JSON with the following structure:
            {
              "normalizedName": "standard ingredient name",
              "category": "ingredient category",
              "similarIngredients": ["similar1", "similar2", "similar3"]
            }
            
            Keep responses concise and focused on common cooking ingredients.`,
          },
          {
            role: "user",
            content: `Normalize this ingredient: "${query}"`,
          },
        ],
        temperature: 0.3,
        max_tokens: 150,
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw error;
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const normalizedData = await normalizeIngredient(query);

      // Create results array with normalized ingredient and similar ingredients
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

      // Update recent searches
      if (!recentSearches.includes(normalizedData.normalizedName)) {
        setRecentSearches((prev) =>
          [normalizedData.normalizedName, ...prev].slice(0, 5)
        );
        // Save to localStorage for persistence
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

        // Fetch the current pantry from the backend
        const responseCurrentPantry = await fetch("http://localhost:3001/api/current_pantry");
        if (!responseCurrentPantry.ok) {
          throw new Error("Failed to fetch the current pantry");
        }

        const { pantryName } = await responseCurrentPantry.json();

        if (!pantryName) {
          alert("No current pantry is set. Please select a pantry first.");
          return;
        }

        // Make a POST request to save the item to the backend
        const response = await fetch("http://localhost:3001/api/store_ingredient", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pantryName,
            name: item.name,
            category: item.category,
          }),
        });
  
        if (response.ok) {
          console.log(`Item ${item.name} added successfully.`);
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
            onKeyPress={(e) => e.key === "Enter" && handleSearch(searchQuery)}
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
