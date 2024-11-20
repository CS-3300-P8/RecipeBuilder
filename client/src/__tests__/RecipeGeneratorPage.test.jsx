import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecipeGeneratorPage from '../pages/RecipeGeneratorPage';
import { BrowserRouter } from 'react-router-dom';

// Mock the API call
jest.mock('../config', () => ({
  API_URL: 'http://localhost:5173'
}));

global.fetch = jest.fn();

describe('RecipeGeneratorPage', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders recipe generator form', () => {
    render(
      <BrowserRouter>
        <RecipeGeneratorPage />
      </BrowserRouter>
    );
    
    expect(screen.getByPlaceholderText(/Enter ingredients/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate recipe/i })).toBeInTheDocument();
  });

  test('handles recipe generation', async () => {
    const mockRecipe = {
      recipe: {
        title: 'Test Recipe',
        ingredients: ['ingredient 1', 'ingredient 2'],
        instructions: ['step 1', 'step 2']
      }
    };

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockRecipe),
      })
    );

    render(
      <BrowserRouter>
        <RecipeGeneratorPage />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/Enter ingredients/i);
    const generateButton = screen.getByRole('button', { name: /generate recipe/i });

    await userEvent.type(input, 'chicken, rice');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/generate-recipe'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.any(Object),
          body: expect.any(String),
        })
      );
    });
  });

  test('handles API errors', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })
    );

    render(
      <BrowserRouter>
        <RecipeGeneratorPage />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/Enter ingredients/i);
    const generateButton = screen.getByRole('button', { name: /generate recipe/i });

    await userEvent.type(input, 'invalid input');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
