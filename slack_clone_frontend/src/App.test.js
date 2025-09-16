import { render, screen } from '@testing-library/react';
import App from './App';

test('renders profile link', () => {
  render(<App />);
  const linkElement = screen.getByText(/profile/i);
  expect(linkElement).toBeInTheDocument();
});
