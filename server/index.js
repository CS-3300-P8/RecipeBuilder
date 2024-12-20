var express = require("express");
const mongoose = require("mongoose");
var app = express();
var cors = require("cors");
const path = require("path");
const OpenAI = require("openai");
const OpenAIServiceFactory = require("./openaiFactory");

const AddIngredientCommand = require("./commands/AddIngredientCommand");
const UpdateCurrentPantryCommand = require("./commands/UpdateCurrentPantryCommand");
const RetrieveCurrentPantryCommand = require("./commands/RetrieveCurrentPantryCommand");
const CreatePantryCommand = require("./commands/CreatePantryCommand");
const DeleteIngredientCommand = require("./commands/DeleteIngredientCommand");
const GetAllPantriesCommand = require("./commands/GetAllPantriesCommand");
const GetIngredientsCommand = require("./commands/GetIngredientsCommand");

const GetPantryNamesCommand = require("./commands/GetPantryNamesCommand");


const { MongoClient, ServerApiVersion } = require("mongodb");

let pantrySchema = new mongoose.Schema({
  PantryName: {
    type: String,
    required: true,
    unique: true,
  },
  ingredients: [
    {
      name: { type: String, required: true },
      category: { type: String, required: false },
    },
  ],
  current: { type: Boolean, default: false },
});

const Pantry = mongoose.model("Pantry", pantrySchema);

console.log(process.env);

mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to Server:", err));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: false,
});

const openAIServiceFactory = new OpenAIServiceFactory(openai);

module.exports = {Pantry, openAIServiceFactory};


// Middleware
// comment this first line in or out to pull from the build.
app.use(express.static(path.join(__dirname, "..", "client", "dist")));
app.use(express.json());
app.use(cors());

// 2D vector to store pantries and their ingredients
let pantries = {};

//let current_pantries;

let DEV = true;

if (DEV == false) {
  // comment this line in or out to pull from the build.
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
  });
}

// Update the normalize ingredient endpoint to use the factory
app.get("/api/normalizeIngredient/:ingredientName", async (req, res) => {
  const query = req.params.ingredientName.trim();

  if (!query) {
    return res.status(400).send({ error: "Must query a real ingredient." });
  }

  try {
    const service = openAIServiceFactory.createService("normalize", {
      ingredientName: query,
    });

    const result = await service.execute();
    return res.status(200).json(JSON.parse(result));
  } catch (e) {
    console.error("OpenAI API error:", e);
    res.status(400).send({ error: e.message });
  }
});

// Add the new recipe generation endpoint
app.post("/api/generate-recipe", async (req, res) => {
  console.log(req.body);
  const { ingredients, dietaryRestrictions, style, type, difficulty } =
    req.body;

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
    const service = openAIServiceFactory.createService("recipe", {
      ingredients,
      dietaryRestrictions,
      style,
      type,
      difficulty,
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
  if (!(await Pantry.findOne({ PantryName: "Default Pantry" }))) {
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
app.post("/api/current_pantry", async (req, res) => {
  const { pantryName } = req.body;

  if (!pantryName) {
    return res.status(400).send({ error: "Pantry name is required." });
  }

  await Pantry.updateMany({}, { current: false });

  try {
    const command = new UpdateCurrentPantryCommand(Pantry, pantryName);
    const updatedPantry = await command.execute();

    return res.status(200).send({
      message: `Current pantry updated to '${pantryName}'.`,
      pantry: updatedPantry,
    });
  } catch (error) {
    return (error); 
  }
});

// Endpoint to retrieve the current pantry and its ingredients
app.get("/api/current_pantry", async (req, res) => {
  try {
    console.log("Getting Current Pantry");
    const command = new RetrieveCurrentPantryCommand(Pantry);
    const pantryData = await command.execute();
    
    res
      .status(200)
      .json({
        pantryName: pantryData.pantryName,
        ingredients: pantryData.ingredients,
      });
  } catch (error) {
    console.log("Error in route");
    return error;
  }
});

// Endpoint to create a new pantry
app.post("/api/create_pantry", async (req, res) => {
  const { pantryName } = req.body;

  if (!pantryName) {
    return res.status(400).send({ error: "Pantry name is required." });
  }

  const command = new CreatePantryCommand(Pantry, pantryName);
  await command.execute();

  console.log(`Pantry '${pantryName}' created.`);
  res
    .status(200)
    .send({ message: `Pantry '${pantryName}' created successfully.` });
});

// Endpoint to add an ingredient to a pantry
app.post("/api/store_ingredient", async (req, res) => {
  console.log("Adding Ingredient");
  const { pantryName, name, category } = req.body;

  if (!pantryName || !name || !category) {
    return res
      .status(400)
      .send({
        error: "Pantry name, ingredient name, and category are required.",
      });
  }

  try {
    const command = new AddIngredientCommand(Pantry, pantryName, { name, category });
    const result = await command.execute();
    console.log("DONE Adding Ingredient");
    return res.status(200).send({
      message: `Ingredient '${name}' added successfully to pantry '${pantryName}'.`,
      pantry: result,
    });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }

});

// Endpoint to delete an ingredient from a pantry
app.delete(
  "/api/pantries/:pantryName/ingredients/:ingredientName",
  async (req, res) => {
    const { pantryName, ingredientName } = req.params;

    if (!pantryName || !ingredientName) {
      return res
        .status(400)
        .send({ error: "Pantry name and ingredient name are required." });
    }

    try {
      // Execute the command
      const command = new DeleteIngredientCommand(Pantry, pantryName, ingredientName);
      const result = await command.execute();

      res.status(200).send({
        message: "Ingredient Deleted",
        result,
      });
    } catch (error) {
      (error);
    }
  }
);

app.get("/api/pantries", async (req, res) => {
  console.log("Getting all pantries");
  const command = new GetAllPantriesCommand(Pantry);
  const pantries = await command.execute();

  res.status(200).json(pantries);
});

// Endpoint to retrieve ingredients of a specific pantry
app.get("/api/pantries/:pantryName", async (req, res) => {
  const { pantryName } = req.params;

  try {
    const command = new GetIngredientsCommand(Pantry, pantryName);
    const ingredients = await command.execute();

    res.status(200).json(ingredients);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.get("/api/pantryNames", async (req, res) => {
  const command = new GetPantryNamesCommand(Pantry);
  const pantryNames = await command.execute();

  res.status(200).json(pantryNames);
});

//Endpoint to delete a pantry
app.delete("/api/pantries/:pantryName", async (req, res) => {
  const pantryName = req.params.pantryName;

  if (!pantryName) {
    return res.status(400).send({ error: "Pantry name is required." });
  }

  let pantry = await Pantry.findOne({ PantryName: pantryName });

  if (!pantry) {
    return res.status(404).send({ error: "Pantry not found." });
  }

  await pantry.deleteOne();

  res
    .status(200)
    .send({ message: `Pantry '${pantryName}' deleted successfully.` });
});

initPantry();

// Create the web server
// var server = app.listen(3001, function () {
//    console.log("Express App running at http://127.0.0.1:3001/");
// });
