import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VirtualPantry from '../pages/VirtualPantry';
import { BrowserRouter } from 'react-router-dom';

describe('VirtualPantry', () => {
  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });

    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ pantries: [], ingredients: [] })
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders virtual pantry component', async () => {
    render(
      <BrowserRouter>
        <VirtualPantry />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/pantry page/i)).toBeInTheDocument();
    expect(screen.getByText(/select a pantry/i)).toBeInTheDocument();
    expect(screen.getByText(/create a new pantry/i)).toBeInTheDocument();
  });

  test('fetches pantries on component mount', async () => {
    const mockPantries = ['Pantry1', 'Pantry2'];
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ pantries: mockPantries })
      })
    );

    render(
      <BrowserRouter>
        <VirtualPantry />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/pantryNames');
      expect(screen.getByText('Pantry1')).toBeInTheDocument();
      expect(screen.getByText('Pantry2')).toBeInTheDocument();
    });
  });

  test('handles API error when fetching pantries', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500
      })
    );

    render(
      <BrowserRouter>
        <VirtualPantry />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/failed to fetch pantries/i);
    });
  });

  test('creates new pantry successfully', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Pantry created successfully' })
      })
    );

    render(
      <BrowserRouter>
        <VirtualPantry />
      </BrowserRouter>
    );

    const pantryNameInput = screen.getByTestId('new-pantry-input');
    const createPantryButton = screen.getByTestId('create-pantry-button');

    await userEvent.type(pantryNameInput, 'New Test Pantry');
    fireEvent.click(createPantryButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/create_pantry',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ pantryName: 'New Test Pantry' })
        })
      );
    });
  });

  test('handles error when creating new pantry', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500
      })
    );

    render(
      <BrowserRouter>
        <VirtualPantry />
      </BrowserRouter>
    );

    const pantryNameInput = screen.getByTestId('new-pantry-input');
    const createPantryButton = screen.getByTestId('create-pantry-button');

    await userEvent.type(pantryNameInput, 'New Test Pantry');
    fireEvent.click(createPantryButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/failed to create pantry/i);
    });
  });

  test('adds new ingredient to pantry', async () => {
    // Mock successful pantry selection
    global.fetch
      .mockImplementationOnce(() => // Initial pantries fetch
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ pantries: ['Test Pantry'] })
        })
      )
      .mockImplementationOnce(() => // Pantry selection
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ ingredients: [] })
        })
      )
      .mockImplementationOnce(() => // Current pantry update
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Current pantry updated' })
        })
      );

    render(
      <BrowserRouter>
        <VirtualPantry />
      </BrowserRouter>
    );

    // Select pantry first
    const select = screen.getByTestId('pantry-select');
    fireEvent.change(select, { target: { value: 'Test Pantry' } });

    // Mock the add ingredient API call
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Ingredient added successfully' })
      })
    );

    await waitFor(() => {
      expect(screen.getByTestId('ingredient-name-input')).toBeInTheDocument();
    });

    // Add ingredient
    const ingredientNameInput = screen.getByTestId('ingredient-name-input');
    const ingredientCategoryInput = screen.getByTestId('ingredient-category-input');
    const addButton = screen.getByTestId('add-ingredient-button');

    await userEvent.type(ingredientNameInput, 'Tomatoes');
    await userEvent.type(ingredientCategoryInput, 'Vegetable');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/store_ingredient',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            pantryName: 'Test Pantry',
            name: 'Tomatoes',
            category: 'Vegetable'
          })
        })
      );
    });
  });

  test('handles error when adding ingredient', async () => {
    // Mock successful pantry selection but failed ingredient addition
    global.fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ pantries: ['Test Pantry'] })
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ ingredients: [] })
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Current pantry updated' })
        })
      );

    render(
      <BrowserRouter>
        <VirtualPantry />
      </BrowserRouter>
    );

    // Select pantry first
    const select = screen.getByTestId('pantry-select');
    fireEvent.change(select, { target: { value: 'Test Pantry' } });

    await waitFor(() => {
      expect(screen.getByTestId('ingredient-name-input')).toBeInTheDocument();
    });

    // Mock the failed add ingredient API call
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500
      })
    );

    // Try to add ingredient
    const ingredientNameInput = screen.getByTestId('ingredient-name-input');
    const ingredientCategoryInput = screen.getByTestId('ingredient-category-input');
    const addButton = screen.getByTestId('add-ingredient-button');

    await userEvent.type(ingredientNameInput, 'Tomatoes');
    await userEvent.type(ingredientCategoryInput, 'Vegetable');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/failed to add ingredient/i);
    });
  });

  test('deletes ingredient from pantry', async () => {
    // Mock successful pantry selection and ingredient list with one item
    global.fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ pantries: ['Test Pantry'] })
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            ingredients: [{ name: 'Tomatoes', category: 'Vegetable' }]
          })
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Current pantry updated' })
        })
      );

    render(
      <BrowserRouter>
        <VirtualPantry />
      </BrowserRouter>
    );

    // Select pantry
    const select = screen.getByTestId('pantry-select');
    fireEvent.change(select, { target: { value: 'Test Pantry' } });

    await waitFor(() => {
      expect(screen.getByTestId('delete-ingredient-0')).toBeInTheDocument();
    });

    // Mock successful delete API call
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Ingredient deleted successfully' })
      })
    );

    // Delete the ingredient
    const deleteButton = screen.getByTestId('delete-ingredient-0');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/pantries/Test%20Pantry/ingredients/Tomatoes',
        expect.objectContaining({
          method: 'DELETE'
        })
      );
    });
  });

  test('handles error when deleting ingredient', async () => {
    // Mock successful pantry selection but failed ingredient deletion
    global.fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ pantries: ['Test Pantry'] })
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            ingredients: [{ name: 'Tomatoes', category: 'Vegetable' }]
          })
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Current pantry updated' })
        })
      );

    render(
      <BrowserRouter>
        <VirtualPantry />
      </BrowserRouter>
    );

    // Select pantry
    const select = screen.getByTestId('pantry-select');
    fireEvent.change(select, { target: { value: 'Test Pantry' } });

    await waitFor(() => {
      expect(screen.getByTestId('delete-ingredient-0')).toBeInTheDocument();
    });

    // Mock failed delete API call
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500
      })
    );

    // Try to delete the ingredient
    const deleteButton = screen.getByTestId('delete-ingredient-0');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/failed to delete ingredient/i);
    });
  });

  test('validates input before adding ingredient', async () => {
    // Mock successful pantry selection
    global.fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ pantries: ['Test Pantry'] })
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ ingredients: [] })
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Current pantry updated' })
        })
      );

    render(
      <BrowserRouter>
        <VirtualPantry />
      </BrowserRouter>
    );

    // Select pantry
    const select = screen.getByTestId('pantry-select');
    fireEvent.change(select, { target: { value: 'Test Pantry' } });

    await waitFor(() => {
      expect(screen.getByTestId('add-ingredient-button')).toBeInTheDocument();
    });

    // Try to add ingredient without name
    const addButton = screen.getByTestId('add-ingredient-button');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/please provide both name and category/i);
    });
  });

  test('validates input before creating pantry', async () => {
    render(
      <BrowserRouter>
        <VirtualPantry />
      </BrowserRouter>
    );

    // Try to create pantry without name
    const createPantryButton = screen.getByTestId('create-pantry-button');
    fireEvent.click(createPantryButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/please provide a pantry name/i);
    });
  });
});
