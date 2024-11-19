const request = require('supertest');
const app = require('./index'); // Path to your Express app file

let server;

beforeAll(() => {
    server = app.listen(4000); // Start the server on a different port
});

afterAll(() => {
    server.close(); // Ensure the server is closed after all tests
});

describe('GET /api/current_pantry', () => {
  it('Should return init pantry and its ingredients', async () => {
      const response = await request(app).get('/api/current_pantry');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
          pantryName: "Default Pantry",
          ingredients: [
              { name: "Salt", category: "Spices" },
              { name: "Sugar", category: "Condiments" },
              { name: "Rice", category: "Grains" },
          ],
      });
  });
});


it('Should return init pantry and its ingredients', async () => {
    const response = await request(app).get('/api/current_pantry');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
        pantryName: "Default Pantry",
        ingredients: [
            { name: "Salt", category: "Spices" },
            { name: "Sugar", category: "Condiments" },
            { name: "Rice", category: "Grains" },
        ],
    });
});

describe('Typical Use Case: Create a new pantry, make it the current pantry, store an ingredient, ', () => {
  it('Should Accept a New Pantry', async () => {
    const response = await request(app).post('/api/create_pantry').send({ pantryName: "New Pantry" });
    expect(response.status).toBe(200);
  });
  it('Verify that New Pantry is stored', async () => {
    const response = await request(app).get('/api/pantries/New Pantry');
    expect(response.status).toBe(200);
  });
  it('Set New Pantry as Current Pantry', async () => {
    const response = await request(app).post('/api/current_pantry').send({ pantryName: "New Pantry" });
    expect(response.status).toBe(200);
  });
  it('Ensure New Pantry is Current Pantry', async () => {
    const response = await request(app).get('/api/current_pantry');
    expect(response.status).toBe(200);
  });
  it('Store Ingredient', async () => {
    const response = await request(app).post('/api/store_ingredient').send({ pantryName: "New Pantry", name: "Spaghetti", category: "Pasta" });
    expect(response.status).toBe(200);
  });
  it('Retrieve Ingredient from Pantry', async () => {
    const response = await request(app).get('/api/current_pantry');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      pantryName: "New Pantry",
      ingredients: [
          { name: "Spaghetti", category: "Pasta" },
      ],
    });
  });
});