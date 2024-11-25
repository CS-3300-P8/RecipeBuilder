let instance;

class PantryMediator {
    constructor(api_url="http://localhost:3001") {
        this.api_url = api_url;

        if (!instance) {
            instance = this;
        }
    }

    async addPantry(pantry) {
        const response = await fetch("http://localhost:3001/api/create_pantry", {
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
        const response = await fetch(`${encodeURIComponent(this.api_url)}/api/current_pantry`, {
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
        const response = await fetch("http://localhost:3001/api/current_pantry");
        if (!response.ok) {
            throw new Error("Failed to fetch pantry data");
        }
        const data = await response.json();
        return data;
    }

    async getIngredients(pantryName) {
        const response = await fetch(`${encodeURIComponent(this.api_url)}/api/pantries/${encodeURIComponent(pantry)}`);
        if (!response.ok) {
        throw new Error("Failed to fetch ingredients");
        }
        const data = await response.json();
        return data;
    }

    async deleteIngredient(pantry, ingredient) {
        const response = await fetch(
            `http://localhost:3001/api/pantries/${encodeURIComponent(pantry)}/ingredients/${encodeURIComponent(ingredient)}`,
            { method: "DELETE" }
        );
        if (!response.ok) {
            throw new Error("Failed to delete ingredient");
        }
    }

    async addIngredient(pantry, ingredient) {
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
    }
}

instance = new PantryMediator(import.meta.env.VITE_API_URL);

export default instance;