import { render, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import SignUp from '../components/Signup';



describe("<Signup>", () => {
    it("simple render", () => {
        const { container, debug } = render(
            <BrowserRouter>
                <SignUp />
            </BrowserRouter>
        );
        // debug();
        const e = fireEvent.click(screen.getByText("Sign Up"))
        console.log(`e is  ${e}`);
        // expect(screen.getByText("Already have an account?")).toBeInTheDocument();
        expect(screen.getByText("Please provide a valid name.")).toBeInTheDocument();
        expect(screen.getByText("Please provide a valid email.")).toBeInTheDocument();
    });
});

