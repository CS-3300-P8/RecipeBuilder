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

describe('Typical User Case: Create a new pantry, make it the current pantry, store an ingredient, ', () => {
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

describe('Typical DB Case: Create Many Pantries (each with ingredient), Retrieve the Names/Ingredients of each, then delete an ingredient from each pantry', () => {
  it('Create many pantries each with an ingredient', async () => {
    for (let i = 1; i <= 1000; i++)
    {
      let pantryName = `New Pantry ${i}`;
      let ingredientName = `Spaghetti ${i}`;

      const response = await request(app).post('/api/create_pantry').send({ pantryName: `New Pantry ${i}` });
      expect(response.status).toBe(200);
      const response2 = await request(app).post('/api/store_ingredient').send({ pantryName: `New Pantry ${i}`, name: ingredientName, category: "Pasta" });
      expect(response2.status).toBe(200);
      const response3 = await request(app).get(`/api/pantries/${encodeURIComponent(pantryName)}`);
      expect(response3.status).toBe(200);
      expect(response3.body).toEqual([{
        name: ingredientName, category: "Pasta",
      }]);
    }
  });
  
  it('Create many pantries each with an ingredient', async () => {
    const response4 = await request(app).get('/api/pantries');
    expect(response4.status).toBe(200);

    const pantries = {};
    for (let i = 1; i <= 1000; i++) {
         pantries[`New Pantry ${i}`] = [{ name: `Spaghetti ${i}`, category: "Pasta"}];
    }
    expect(response4.body).toEqual(pantries);
  });

  it('Delete Ingredient from each pantry', async () => {
    for (let i = 1; i <= 1000; i++)
    {
      let pantryName = `New Pantry ${i}`;
      let ingredientName = `Spaghetti ${i}`;
      const response5 = await request(app).delete(`/api/pantries/${encodeURIComponent(pantryName)}/ingredients/${encodeURIComponent(ingredientName)}`);
      expect(response5.status).toBe(200);
      const response6 = await request(app).get(`/api/pantries/${encodeURIComponent(pantryName)}`);
      expect(response6.status).toBe(200);
      expect(response6.body).toEqual([]);

    }
  });

});