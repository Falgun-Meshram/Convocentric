import { render, screen } from '@testing-library/react';
import React from 'react';

import Chat from '../components/';Chat

describe("<Chat>", () => {
  it("simple render", () => {
    const { container } = render(<Chat />);
    // expect(screen.getAllByText("React")).toBeInTheDocument();
  });
});
