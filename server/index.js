var express = require('express');
var app = express();
var cors = require('cors');

// Middleware
app.use(express.json());
app.use(cors());

// 2D vector to store pantries and their ingredients
let pantries = {};

// Initialize a pantry with default values
const initPantry = () => {
   pantries["Default Pantry"] = [
      { name: "Salt", category: "Spices" },
      { name: "Sugar", category: "Condiments" },
      { name: "Rice", category: "Grains" },
   ];
   console.log("Default pantry initialized.");
};

// Endpoint to create a new pantry
app.post('/api/create_pantry', (req, res) => {
   const { pantryName } = req.body;

   if (!pantryName) {
      return res.status(400).send({ error: "Pantry name is required." });
   }

   if (pantries[pantryName]) {
      return res.status(400).send({ error: "Pantry already exists." });
   }

   pantries[pantryName] = []; // Initialize an empty ingredient list
   console.log(`Pantry '${pantryName}' created.`);
   res.status(200).send({ message: `Pantry '${pantryName}' created successfully.` });
});

// Endpoint to add an ingredient to a pantry
app.post('/api/store_ingredient', (req, res) => {
   const { pantryName, name, category } = req.body;

   if (!pantryName || !name || !category) {
      return res.status(400).send({ error: "Pantry name, ingredient name, and category are required." });
   }

   if (!pantries[pantryName]) {
      return res.status(404).send({ error: "Pantry not found." });
   }

   pantries[pantryName].push({ name, category });
   console.log(`Ingredient '${name}' added to pantry '${pantryName}'.`);
   res.status(200).send({ message: `Ingredient '${name}' added successfully to pantry '${pantryName}'.` });
});

// Endpoint to delete an ingredient from a pantry
app.delete('/api/pantries/:pantryName/ingredients/:ingredientName', (req, res) => {
   const { pantryName, ingredientName } = req.params;

   if (!pantries[pantryName]) {
      return res.status(404).send({ error: "Pantry not found." });
   }

   const ingredientIndex = pantries[pantryName].findIndex(
      (ingredient) => ingredient.name.toLowerCase() === ingredientName.toLowerCase()
   );

   if (ingredientIndex === -1) {
      return res.status(404).send({ error: "Ingredient not found in the pantry." });
   }

   pantries[pantryName].splice(ingredientIndex, 1); // Remove the ingredient
   console.log(`Ingredient '${ingredientName}' removed from pantry '${pantryName}'.`);

   res.status(200).send({ message: `Ingredient '${ingredientName}' deleted successfully.` });
});

// Endpoint to retrieve all pantries and their ingredients
app.get('/api/pantries', (req, res) => {
   res.json(pantries);
});

// Endpoint to retrieve ingredients of a specific pantry
app.get('/api/pantries/:pantryName', (req, res) => {
   const pantryName = req.params.pantryName;

   if (!pantries[pantryName]) {
      return res.status(404).send({ error: "Pantry not found." });
   }

   res.json(pantries[pantryName]);
});

// Endpoint to retrieve the names of all pantries
app.get('/api/pantryNames', (req, res) => {
   // Get the keys of the pantries object, which represent pantry names
   const pantryNames = Object.keys(pantries);

   // Respond with the list of pantry names
   res.json(pantryNames);
});

initPantry();

// Create the web server
var server = app.listen(3001, function () {
   console.log("Express App running at http://127.0.0.1:3001/");
});
