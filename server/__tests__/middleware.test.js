const request = require('supertest');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

describe('Middleware Tests', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(cors());
    
    // Custom body parser middleware with content-type check
    app.use((req, res, next) => {
      if (req.method === 'POST' && req.headers['content-type'] !== 'application/json') {
        return res.status(415).json({ error: 'Unsupported Media Type' });
      }
      next();
    });

    app.use(bodyParser.json());
    
    // Add error handling middleware
    app.use((err, req, res, next) => {
      if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(415).json({ error: 'Invalid JSON format' });
      }
      next(err);
    });

    // Test route
    app.post('/test', (req, res) => {
      res.json(req.body);
    });
  });

  describe('CORS Middleware', () => {
    it('should have CORS headers', async () => {
      const response = await request(app)
        .options('/test')
        .set('Origin', 'http://localhost:5173');
      
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('Body Parser Middleware', () => {
    it('should parse JSON body', async () => {
      const testData = { test: 'data' };
      const response = await request(app)
        .post('/test')
        .send(testData)
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(testData);
    });

    it('should reject non-JSON content type', async () => {
      const response = await request(app)
        .post('/test')
        .set('Content-Type', 'text/plain')
        .send('plain text');
      
      expect(response.status).toBe(415);
    });
  });

  describe('Error Handling Middleware', () => {
    it('should handle validation errors', async () => {
      const response = await request(app)
        .post('/test')
        .send('{"invalid json')
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(415);
    });

    it('should handle missing required fields', async () => {
      app.post('/validate', (req, res) => {
        if (!req.body.required) {
          res.status(400).json({ error: 'Missing required field' });
        } else {
          res.json(req.body);
        }
      });

      const response = await request(app)
        .post('/validate')
        .send({})
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(400);
    });

    it('should handle invalid pantry operations', async () => {
      app.post('/pantry', (req, res) => {
        if (!req.body.operation) {
          res.status(400).json({ error: 'Invalid pantry operation' });
        } else {
          res.json(req.body);
        }
      });

      const response = await request(app)
        .post('/pantry')
        .send({})
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(400);
    });
  });
});
