import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IngredientSearchPage from '../pages/IngredientSearchPage';
import { BrowserRouter } from 'react-router-dom';

describe('IngredientSearchPage', () => {
  beforeEach(() => {
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ingredients: ['Apple', 'Banana'] })
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders search page', () => {
    render(
      <BrowserRouter>
        <IngredientSearchPage />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/search ingredients/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('performs search and displays results', async () => {
    render(
      <BrowserRouter>
        <IngredientSearchPage />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search ingredients/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    await userEvent.type(searchInput, 'fruit');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/ingredients/search'),
      expect.any(Object)
    );
  });

  test('handles search error', async () => {
    // Mock fetch to return an error
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      })
    );

    render(
      <BrowserRouter>
        <IngredientSearchPage />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search ingredients/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    await userEvent.type(searchInput, 'error test');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  test('handles empty search results', async () => {
    // Mock fetch to return empty results
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ingredients: [] })
      })
    );

    render(
      <BrowserRouter>
        <IngredientSearchPage />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search ingredients/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    await userEvent.type(searchInput, 'nonexistent');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/no ingredients found/i)).toBeInTheDocument();
    });
  });

  test('handles network error', async () => {
    // Mock fetch to throw network error
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

    render(
      <BrowserRouter>
        <IngredientSearchPage />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search ingredients/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    await userEvent.type(searchInput, 'test');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });
});
