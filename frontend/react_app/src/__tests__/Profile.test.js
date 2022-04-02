import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import React from 'react';
import { setupServer } from 'msw/node';
import { rest } from 'msw'
import { BrowserRouter } from 'react-router-dom';

import Profile from '../components/Profile';

//TODO Fix the test case for updated UI

const server = setupServer(
    rest.post("hhttp://127.0.0.1:8000/api/edit_profile", (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                ok: true,
                error: "",
                user: {
                    firstName: 'asd',
                    lastName: 'tsf',
                    email: 'test1@test.com',
                    profilePicture: '',
                    userName: 'test',
                }
            }))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("<Profile>", () => {
    it("Page should render", () => {
        const { container, debug } = render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );
    });
    it("Profile firstname, last name and email validation", async () => {
        const { container, debug } = render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );
        const firstname = screen.getByPlaceholderText("First name");
        const lastname = screen.getByPlaceholderText("Last name");
        const email = screen.getByPlaceholderText("Enter your email");
        const userName = screen.getByPlaceholderText("Enter Username");
        fireEvent.change(firstname, { target: { value: "asd" } })
        fireEvent.change(lastname, { target: { value: "tsf" } })
        fireEvent.change(email, { target: { value: "test1@test.com" } })
        fireEvent.change(userName, { target: { value: "test" } })

        const save_button = screen.getByText("Save");
        userEvent.click(screen.getByText("Save"))
        // const password_button = screen.getByPlaceholderText("Change Password");
        const c = await screen.findByText(/Successfully updated values/i);
        expect(c).toBeInTheDocument();

    }
    )
})

