import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Signin from '../components/Signin';
import SignUp from '../components/Signup';



describe("<Signup>", () => {
    it("Page should render", () => {
        const { container, debug } = render(
            <BrowserRouter>
                <SignUp />
            </BrowserRouter>
        );
    });
    it("Input Validation", () => {
        const { container, debug } = render(
            <BrowserRouter>
                <SignUp />
            </BrowserRouter>
        );
        // debug();
        const e = fireEvent.click(screen.getByText("Sign Up"))
        console.log(`e is  ${e}`);
        // expect(screen.getByText("Already have an account?")).toBeInTheDocument();
        expect(screen.getByText("Please provide a valid name")).toBeInTheDocument();
        expect(screen.getByText("Please provide a valid email")).toBeInTheDocument();
        expect(screen.getByText("Your password must be atleast 8 characters, and must contain atleast one capital letter, one small letter and one number and one special character")).toBeInTheDocument();
        expect(screen.getByText("Password should match")).toBeInTheDocument();
    }
    )
    it("Redirect to Login", () => {
        const { container, debug } = render(
            <BrowserRouter>
                <SignUp />
                <Signin />
            </BrowserRouter>
        );
        const e = fireEvent.click(screen.getByText("Sign In"))
        // debug()
        expect(screen.getByText("Create an account")).toBeInTheDocument()
        // expect(screen.getByText(/Create an account/i)).toBeInTheDocument();

    }
    )
});

