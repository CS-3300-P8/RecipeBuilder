//https://www.tutorialspoint.com/nodejs/nodejs_express_framework.htm
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
const path = require('path');
const OpenAI = require("openai");

const openai = new OpenAI({
   apiKey: "KEY_HERE",
   dangerouslyAllowBrowser: false,
 });

// Middleware
// comment this first line in or out to pull from the build.
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
app.use(express.json());
app.use(cors());

// 2D vector to store pantries and their ingredients
let pantries = {};

let current_pantries;

// comment this line in or out to pull from the build.
app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
});

app.get('/api/normalizeIngredient/:ingredientName', async (req, res) => {
   const query = req.params.ingredientName.trim();

   if (!query) {
      return res.status(400).send({ error: "Must query a real ingredient." });
   }

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

      console.log(completion.choices[0].message.content);
      return res.status(200).json(completion.choices[0].message.content);
    } catch (e) {
      console.error("OpenAI API error:", e);
      res.status(400).send({ error: e });
    }
});

// Create the web server
var server = app.listen(3001, function () {
   console.log("Express App running at http://127.0.0.1:3001/");
});