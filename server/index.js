var express = require('express');
const mongoose = require('mongoose');
var app = express();
var cors = require('cors');
const path = require('path');
const OpenAI = require("openai");
const OpenAIServiceFactory = require('./openaiFactory');

const { MongoClient, ServerApiVersion } = require('mongodb');

let pantrySchema = new mongoose.Schema({
   PantryName: 
   {
      type: String, required: true, unique: true,
   },
   ingredients: [
      {
         name: {type: String, required: true},
         category: {type: String, required: false}
      },
   ],
   current: {type: Boolean, default: false}
});

const Pantry = mongoose.model('Pantry', pantrySchema);

console.log(process.env);

mongoose.connect(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => console.log('Connected to MongoDB'))
   .catch(err => console.error('Could not connect to Server:', err))

const openai = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
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

//let current_pantries;

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
   const { ingredients, dietaryRestrictions, style, type, difficulty } = req.body;
 
   if (!ingredients || !Array.isArray(ingredients)) {
     return res.status(400).send({ error: "Invalid ingredients list" });
   }

   console.log("Inside app.post in index.js");
   console.log(ingredients);
   console.log(dietaryRestrictions); 
   console.log(style);
   console.log(type);
   console.log(difficulty);
 
   try {
     const service = openAIServiceFactory.createService('recipe', {
       ingredients,
       dietaryRestrictions,
       style,
       type,
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

// Init Default Pantry
const initPantry = async () => {

   if (!(await Pantry.findOne({PantryName: "Default Pantry"})))
   {
      // Create the Default Pantry and set it to current
      await Pantry.create({
         PantryName: "Default Pantry",
         ingredients: [
           { name: "Salt", category: "Spices" },
           { name: "Sugar", category: "Condiments" },
           { name: "Rice", category: "Grains" },
         ],
         current: true, // Set as the current pantry
      });
   }
};



// Endpoint to update the current pantry
app.post('/api/current_pantry', async (req, res) => {
   const { pantryName } = req.body;

   if (!pantryName) {
      return res.status(400).send({ error: "Pantry name is required." });
   }

   await Pantry.updateMany({}, { current: false});


   let current_pantries = await Pantry.findOneAndUpdate(
      { PantryName: pantryName },
      { current: true },
      { new: true } 
   );

   if (!current_pantries) {
      return res.status(404).send({ error: "Pantry not found." });
   }


   console.log(`Current pantry updated to '${pantryName}'.`);
   res.status(200).send({ message: `Current pantry updated to '${pantryName}'.` });
});

// Endpoint to retrieve the current pantry and its ingredients
app.get('/api/current_pantry', async (req, res) => {
   let current_pantries = await Pantry.findOne({ current: true });

   if (!current_pantries) {
      return res.status(404).send({ error: "No current pantry set." });
   }

   const ingredients = current_pantries.ingredients || [];
   res.status(200).json({ pantryName: current_pantries.PantryName, ingredients: current_pantries.ingredients });
});

// Endpoint to create a new pantry
app.post('/api/create_pantry', async (req, res) => {
   const { pantryName } = req.body;

   if (!(pantryName)) {
      return res.status(400).send({ error: "Pantry name is required." });
   }

   if ((await Pantry.findOne({ PantryName: pantryName }))) {
      return res.status(400).send({ error: "Pantry already exists." });
   }

   await Pantry.create({ PantryName: pantryName, ingredients: [] });
   console.log(`Pantry '${pantryName}' created.`);
   res.status(200).send({ message: `Pantry '${pantryName}' created successfully.` });
});

// Endpoint to add an ingredient to a pantry
app.post('/api/store_ingredient', async (req, res) => {
   const { pantryName, name, category } = req.body;

   if (!pantryName || !name || !category) {
      return res.status(400).send({ error: "Pantry name, ingredient name, and category are required." });
   }

   let pantry = await Pantry.findOne({ PantryName: pantryName });


   if (!pantry) {
      return res.status(404).send({ error: "Pantry not found." });
   }

   let ingredients = pantry.ingredients.find(
      (ingredient) => ingredient.name.toLowerCase() === name.toLowerCase()
   );

   if (ingredients) {
      return res.status(200).send({ message: `Ingredient '${name}' already in pantry '${pantryName}` });
   }

   pantry.ingredients.push({ name, category });
   await pantry.save();

   console.log(`Ingredient '${name}' added to pantry '${pantryName}'.`);
   res.status(200).send({ message: `Ingredient '${name}' added successfully to pantry '${pantryName}'.` });
});

// Endpoint to delete an ingredient from a pantry
app.delete('/api/pantries/:pantryName/ingredients/:ingredientName', async (req, res) => {
   const { pantryName, ingredientName } = req.params;

   if (!pantryName || !ingredientName) {
      return res.status(400).send({ error: "Pantry name and ingredient name are required." });
   }


   let pantry = await Pantry.findOne({ PantryName: pantryName });

   if (!pantry) {
      return res.status(404).send({ error: "Pantry not found." });
   }

   let ingredientIndex = pantry.ingredients.findIndex(
      (ingredient) => ingredient.name.toLowerCase() === ingredientName.toLowerCase()
   );

   if (ingredientIndex === -1) {
      return res.status(404).send({ error: "Ingredient not found in the pantry." });
   }

   pantry.ingredients.splice(ingredientIndex, 1); // Remove the ingredient
   await pantry.save();

   res.status(200).send({ message: `Ingredient '${ingredientName}' deleted successfully.` });
});

// Endpoint to retrieve all pantries and their ingredients
app.get('/api/pantries', async (req, res) => {
   res.json(await Pantry.find());
});

// Endpoint to retrieve ingredients of a specific pantry
app.get('/api/pantries/:pantryName', async (req, res) => {
   const pantryName = req.params.pantryName;

   if (!pantryName) {
      return res.status(400).send({ error: "Pantry name and ingredient name are required." });
   }

   let pantry = await Pantry.findOne({ PantryName: pantryName });

   if (!(pantry)) {
      return res.status(404).send({ error: "Pantry not found." });
   }

   res.json(pantry.ingredients);
});

// Endpoint to retrieve the names of all pantries
app.get('/api/pantryNames', async (req, res) => {
   res.json((await Pantry.find({}, 'PantryName')).map(pantry => pantry.PantryName));
});

initPantry();

// Create the web server
// var server = app.listen(3001, function () {
//    console.log("Express App running at http://127.0.0.1:3001/");
// });