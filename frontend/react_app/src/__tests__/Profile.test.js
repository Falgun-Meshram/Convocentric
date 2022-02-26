import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from '../components/App';
import Profile from '../components/ProfilePage';
import Signin from '../components/Signin';
import SignUp from '../components/Signup';



describe("<Profile>", () => {
    it("Page should render", () => {
        const { container, debug } = render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );
    });
    it("Profile firstname, last name and email validation", () => {
        const { container, debug } = render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );
        const firstname = screen.getByPlaceholderText("First Name");
        const lastname = screen.getByPlaceholderText("Last Name");
        const email = screen.getByPlaceholderText("Enter your email");
        fireEvent.change(userNameInput, { target: { value: "asd" } })
        fireEvent.change(emailInput, { target: { value: "tsf" } })
        fireEvent.change(passwordInput, { target: { value: "asdfQW!@34" } })
        const save_button = screen.getByPlaceholderText("Save");
        fireEvent.click();
        const password_button = screen.getByPlaceholderText("Change Password");
        fireEvent.click();
 
    }
    )
  
});

