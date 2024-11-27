let instance;

//const PROD_URL = "http://localhost:3001";
const PROD_URL = "https://round-office-437918-e3.ue.r.appspot.com";

class PantryMediator {
  constructor(api_url = PROD_URL) {
    this.api_url = api_url;

    if (!instance) {
      instance = this;
    }
  }

  async addPantry(pantry) {
    const response = await fetch(`${this.api_url}/api/create_pantry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pantryName: pantry,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add Pantry");
    }
  }

  async setCurrentPantry(pantry) {
    const response = await fetch(`${this.api_url}/api/current_pantry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pantryName: pantry, // Use the updated pantry name here
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update current pantry");
    }
  }

  async getCurrentPantry() {
    const response = await fetch(`${this.api_url}/api/current_pantry`);
    if (!response.ok) {
      throw new Error("Failed to fetch pantry data");
    }
    const data = await response.json();
    return data;
  }

  async getPantryNames() {
    const response = await fetch(`${this.api_url}/api/pantryNames`);
    if (!response.ok) {
      throw new Error("Failed to fetch pantry data");
    }
    const data = await response.json();
    return data;
  }

  async getIngredients(pantryName) {
    const response = await fetch(
      `${this.api_url}/api/pantries/${encodeURIComponent(pantryName)}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch ingredients");
    }
    const data = await response.json();
    return data;
  }

  async deleteIngredient(pantry, ingredient) {
    const response = await fetch(
      `${this.api_url}/api/pantries/${encodeURIComponent(
        pantry
      )}/ingredients/${encodeURIComponent(ingredient)}`,
      { method: "DELETE" }
    );
    if (!response.ok) {
      throw new Error("Failed to delete ingredient");
    }
  }

  async addIngredient(pantry, ingredient, cat) {
    const response = await fetch(`${this.api_url}/api/store_ingredient`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pantryName: pantry,
        name: ingredient,
        category: cat,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add ingredient");
    }
  }

  async deletePantry(pantry) {
    const response = await fetch(
      `${this.api_url}/api/pantries/${encodeURIComponent(pantry)}`,
      { method: "DELETE" }
    );
    if (!response.ok) {
      throw new Error("Failed to delete pantry");
    }
  }
}

instance = new PantryMediator(import.meta.env.VITE_API_URL);

export default instance;
