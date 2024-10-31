import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the "Learn React" link on the homepage', () => {
  render(<App />);

  const linkElement = screen.getByText(/learn react/i);

  expect(linkElement).toBeInTheDocument();

  expect(linkElement).toHaveAttribute('href', 'https://reactjs.org');
});
