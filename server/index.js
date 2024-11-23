var express = require('express');
var app = express();
var cors = require('cors');
const path = require('path');
const OpenAI = require("openai");
const OpenAIServiceFactory = require('./openaiFactory');


const openai = new OpenAI({
   apiKey: "YOUR_API_KEY",
   dangerouslyAllowBrowser: false,
 });

const openAIServiceFactory = new OpenAIServiceFactory(openai);


// Middleware
// comment this first line in or out to pull from the build.
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
app.use(express.json());
app.use(cors());

// 2D vector to store pantries and their ingredients
let pantries = {};

let current_pantries;

let DEV = true;

if (DEV == false) {
   // comment this line in or out to pull from the build.
   app.get('/', function (req, res) {
      res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
   });
}

// Update the normalize ingredient endpoint to use the factory
app.get('/api/normalizeIngredient/:ingredientName', async (req, res) => {
   const query = req.params.ingredientName.trim();
 
   if (!query) {
     return res.status(400).send({ error: "Must query a real ingredient." });
   }
 
   try {
     const service = openAIServiceFactory.createService('normalize', {
       ingredientName: query
     });
     
     const result = await service.execute();
     return res.status(200).json(JSON.parse(result));
   } catch (e) {
     console.error("OpenAI API error:", e);
     res.status(400).send({ error: e.message });
   }
 });

// Add the new recipe generation endpoint
app.post('/api/generate-recipe', async (req, res) => {
   console.log(req.body);
   const { ingredients, dietaryRestrictions, style, difficulty } = req.body;
 
   if (!ingredients || !Array.isArray(ingredients)) {
     return res.status(400).send({ error: "Invalid ingredients list" });
   }

   console.log("Inside app.post in index.js");
   console.log(ingredients);
   console.log(dietaryRestrictions); 
   console.log(style);
   console.log(difficulty);
 
   try {
     const service = openAIServiceFactory.createService('recipe', {
       ingredients,
       dietaryRestrictions,
       style,
       difficulty
     });
     
     const result = await service.execute();
     return res.status(200).json(JSON.parse(result));
   } catch (e) {
     console.error("OpenAI API error:", e);
     res.status(400).send({ error: e.message });
   }
 });

// Create the web server
var server = app.listen(3001, function () {
   console.log("Express App running at http://127.0.0.1:3001/");
});
/*
app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
});
*/

// Initialize a pantry with default values
const initPantry = () => {
   pantries["Default Pantry"] = [
      { name: "Salt", category: "Spices" },
      { name: "Sugar", category: "Condiments" },
      { name: "Rice", category: "Grains" },
   ];
   current_pantries = "Default Pantry"
   console.log("Default pantry initialized.");
};

// Endpoint to update the current pantry
app.post('/api/current_pantry', (req, res) => {
   const { pantryName } = req.body;

   if (!pantryName) {
      return res.status(400).send({ error: "Pantry name is required." });
   }

   if (!pantries[pantryName]) {
      return res.status(404).send({ error: "Pantry not found." });
   }

   current_pantries = pantryName;
   console.log(`Current pantry updated to '${pantryName}'.`);
   res.status(200).send({ message: `Current pantry updated to '${pantryName}'.` });
});

// Endpoint to retrieve the current pantry and its ingredients
app.get('/api/current_pantry', (req, res) => {
   if (!current_pantries) {
      return res.status(404).send({ error: "No current pantry set." });
   }

   const ingredients = pantries[current_pantries] || [];
   res.status(200).json({ pantryName: current_pantries, ingredients });
});

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

   if (pantries[pantryName].some((value) => {
      return value.name.toLowerCase() == name.toLowerCase()
   })) {
      return res.status(200).send({ message: `Ingredient '${name}' already in pantry '${pantryName}` });
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
// var server = app.listen(3001, function () {
//    console.log("Express App running at http://127.0.0.1:3001/");
// });