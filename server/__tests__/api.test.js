const request = require('supertest');
const express = require('express');
const app = require('../index');

jest.mock('../services/openaiFactory', () => ({
  createService: jest.fn((type, options) => ({
    execute: jest.fn().mockResolvedValue('Mocked recipe response')
  }))
}));

describe('API Endpoints', () => {
  describe('GET /', () => {
    it('should return 200 OK', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
    });

    it('should return HTML content', async () => {
      const response = await request(app).get('/');
      expect(response.headers['content-type']).toMatch(/html/);
    });
  });

  describe('POST /api/generate-recipe', () => {
    it('should return 400 if no ingredients are provided', async () => {
      const response = await request(app)
        .post('/api/generate-recipe')
        .send({})
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(400);
    });

    it('should return 400 if ingredients is not an array', async () => {
      const response = await request(app)
        .post('/api/generate-recipe')
        .send({ ingredients: 'not an array' })
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(400);
    });

    it('should return 200 with recipe data when valid ingredients are provided', async () => {
      const response = await request(app)
        .post('/api/generate-recipe')
        .send({
          ingredients: ['tomato', 'pasta'],
          dietaryRestrictions: [],
          difficulty: 'easy'
        })
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    }, 10000);

    it('should handle special characters in ingredients', async () => {
      const response = await request(app)
        .post('/api/generate-recipe')
        .send({
          ingredients: ['jalapeño', 'garlic'],
          dietaryRestrictions: [],
          difficulty: 'medium'
        })
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    }, 10000);
  });

  describe('GET /api/normalizeIngredient/:ingredientName', () => {
    it('should return 400 if ingredient name is empty', async () => {
      const response = await request(app)
        .get('/api/normalizeIngredient/ ')
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should normalize valid ingredient name', async () => {
      const response = await request(app)
        .get('/api/normalizeIngredient/tomato')
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
  });

  describe('Pantry API Endpoints', () => {
    it('should create new pantry', async () => {
      const response = await request(app)
        .post('/api/create_pantry')
        .send({ name: 'TestPantry' })
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(200);
    });

    it('should get current pantry', async () => {
      const response = await request(app)
        .get('/api/current_pantry')
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(200);
    });

    it('should store ingredient in pantry', async () => {
      const response = await request(app)
        .post('/api/store_ingredient')
        .send({
          name: 'TestIngredient',
          category: 'Test'
        })
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(200);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for undefined routes', async () => {
      const response = await request(app)
        .get('/undefined-route');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Not Found');
    });

    it('should return 405 for unsupported methods', async () => {
      const response = await request(app)
        .put('/api/generate-recipe');
      
      expect(response.status).toBe(405);
      expect(response.body.error).toBe('Method Not Allowed');
    });

    it('should handle server errors gracefully', async () => {
      // Mock a route that throws an error
      app.get('/error-test', () => {
        throw new Error('Test error');
      });

      const response = await request(app)
        .get('/error-test');
      
      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
  });
});
