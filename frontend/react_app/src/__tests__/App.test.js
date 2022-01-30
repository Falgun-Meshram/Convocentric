import { render, screen } from '@testing-library/react';
import React from 'react';

import App from '../components/App';

describe("<App>", () => {
  it("simple render", () => {
    const { container } = render(<App />);
    // expect(screen.getAllByText("React")).toBeInTheDocument();
  });
});

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
