const express = require('express');
const cors = require('cors');
const path = require('path');
const openAIServiceFactory = require('./services/openaiFactory');

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'test' ? 'http://localhost:5173' : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Content-type check middleware
app.use((req, res, next) => {
  if (req.method === 'POST' && req.headers['content-type'] !== 'application/json') {
    return res.status(415).json({ error: 'Unsupported Media Type' });
  }
  next();
});

// Body parser middleware
app.use(express.json({
  verify: (req, res, buf, encoding) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(415).json({ error: 'Invalid JSON format' });
      throw new Error('Invalid JSON format');
    }
  }
}));

// Root route handler
app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'test') {
    res.send('<html><body>Test HTML</body></html>');
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

// Recipe generation endpoint
app.post('/api/generate-recipe', async (req, res) => {
  try {
    const { ingredients, dietaryRestrictions, difficulty } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: 'Invalid ingredients list' });
    }

    const service = openAIServiceFactory.createService('recipe', {
      ingredients,
      dietaryRestrictions,
      difficulty
    });

    const recipe = await service.execute();
    res.json({ recipe });
  } catch (error) {
    console.error('Recipe generation error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Ingredient normalization endpoint
app.get('/api/normalizeIngredient/:ingredientName?', async (req, res) => {
  const query = req.params.ingredientName?.trim();
  
  if (!query) {
    return res.status(400).json({ error: 'Ingredient name is required' });
  }

  try {
    const service = openAIServiceFactory.createService('normalize', {
      ingredientName: query
    });
    const result = await service.execute();
    return res.status(200).json({ normalized: result });
  } catch (e) {
    console.error("OpenAI API error:", e);
    res.status(400).json({ error: e.message });
  }
});

// Pantry endpoints
let currentPantry = {
  name: 'Default Pantry',
  ingredients: []
};

app.post('/api/create_pantry', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Pantry name is required' });
  }
  currentPantry = { name, ingredients: [] };
  res.json(currentPantry);
});

app.get('/api/current_pantry', (req, res) => {
  res.json(currentPantry);
});

app.post('/api/store_ingredient', (req, res) => {
  const { name, category } = req.body;
  if (!name || !category) {
    return res.status(400).json({ error: 'Name and category are required' });
  }
  currentPantry.ingredients.push({ name, category });
  res.json(currentPantry);
});

// Test error route
app.get('/error-test', () => {
  throw new Error('Test error');
});

// Method not allowed handler
app.use((req, res, next) => {
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
  // Check if the method is not allowed for the route
  const allowedMethods = {
    '/api/generate-recipe': ['POST'],
    '/api/create_pantry': ['POST'],
    '/api/current_pantry': ['GET'],
    '/api/store_ingredient': ['POST']
  };

  const routeMethods = allowedMethods[req.path];
  if (routeMethods && !routeMethods.includes(req.method)) {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  res.status(404).json({ error: 'Not Found' });
});

// Only start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;