import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from '../components/App';
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
    it("Input Validation: No input given", () => {
        const { container, debug } = render(
            <BrowserRouter>
                <SignUp />
            </BrowserRouter>
        );
        expect(screen.getByText("Please provide a valid name")).toBeInTheDocument();
        expect(screen.getByText("Please provide a valid email")).toBeInTheDocument();
        expect(screen.getByText("Your password must be atleast 8 characters, and must contain atleast one capital letter, one small letter and one number and one special character")).toBeInTheDocument();
        expect(screen.getByText("Password should match")).toBeInTheDocument();
    }
    )
    it("Input Validation: Correct input given", () => {
        const { container, debug } = render(
            <BrowserRouter>
                <SignUp />
                <App />
            </BrowserRouter>
        );
        console.log(`container ${container}`);
        const userNameInput = screen.getByPlaceholderText("Enter an username");
        const emailInput = screen.getByPlaceholderText("name@example.com");
        const passwordInput = screen.getByPlaceholderText("Enter a password");
        const confirmInput = screen.getByPlaceholderText("Confirm password");

        console.log(userNameInput);

        fireEvent.change(userNameInput, { target: { value: "asd" } })
        fireEvent.change(emailInput, { target: { value: "na@ex.com" } })
        fireEvent.change(passwordInput, { target: { value: "asdfQW!@34" } })
        fireEvent.change(confirmInput, { target: { value: "asdfQW!@34" } })
        const e = fireEvent.click(screen.getByText("Sign Up"))
        expect(screen.getByText("Profile Data")).toBeInTheDocument();

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
        expect(screen.getByText("Create an account")).toBeInTheDocument()

    }
    )
});

