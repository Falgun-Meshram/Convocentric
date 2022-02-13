import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from '../components/App';
import Signin from '../components/Signin';
import SignUp from '../components/Signup';



describe("<Signin>", () => {
    it("Page should render", () => {
        const { container, debug } = render(
            <BrowserRouter>
                <Signin />
            </BrowserRouter>
        );
    });
    // it("Input Validation: No input given", () => {
    //     const { container, debug } = render(
    //         <BrowserRouter>
    //             <SignUp />
    //         </BrowserRouter>
    //     );
    //     expect(screen.getByText("Please provide a valid name")).toBeInTheDocument();
    //     expect(screen.getByText("Please provide a valid email")).toBeInTheDocument();
    //     expect(screen.getByText("Your password must be atleast 8 characters, and must contain atleast one capital letter, one small letter and one number and one special character")).toBeInTheDocument();
    //     expect(screen.getByText("Password should match")).toBeInTheDocument();
    // }
    // )
    it("Input Validation: Correct input given", () => {
        const { container, debug } = render(
            <BrowserRouter>
                <SignUp />
                <App />
            </BrowserRouter>
        );
        console.log(`container ${container}`);
        const userNameInput = screen.getByPlaceholderText("Username");
        const passwordInput = screen.getByPlaceholderText("Password");

        console.log(userNameInput);

        fireEvent.change(userNameInput, { target: { value: "asd" } })
        fireEvent.change(passwordInput, { target: { value: "asdfQW!@34" } })
        const e = fireEvent.click(screen.getByText("Sign Up"))
        expect(screen.getByText("Profile Data")).toBeInTheDocument();

    }
    )
    it("Redirect to Signup", () => {
        const { container, debug } = render(
            <BrowserRouter>
                <Signin />
                <SignUp />

            </BrowserRouter>
        );
        const e = fireEvent.click(screen.getByText("Sign Up"))
        expect(screen.getByText("Already have an account")).toBeInTheDocument()

    }
    )
});

