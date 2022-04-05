import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Chat from '../components/Chat';
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import Signin from '../components/Signin';
import SignUp from '../components/Signup';


const server = setupServer(
    rest.post("http://127.0.0.1:8000/api/login", (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                ok: true,
                error: ""
            }))
    })
)
const user = '{ "id": 1, "password": "pbkdf2_sha256$320000$GQuoWffBrr1vLvXLgbTCd1$9cfnIcqpnq6B+02cp5AhlwvLaaCKLenulqK9/e4JxQ8=", "is_superuser": false, "is_staff": false, "is_active": true, "date_joined": "2022-03-17T16:12:04.037632Z", "first_name": null, "last_name": null, "email": "test1@test.com", "created_on": "2022-03-17T16:10:41.719550Z", "updated_on": "2022-03-17T16:10:41.719723Z", "profile_picture": "", "last_passwords": null, "locked": null, "last_login": "2022-03-31T18:44:50.351243Z", "username": "test1", "groups": [], "user_permissions": [] }'

beforeAll(() => {
    localStorage.setItem('user', user)
    server.listen()
})
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// const path = require('path');
// require('dotenv').config({ path: path.resolve(__dirname, 'D:\All other folders\convocentric\frontend\react_app\src\.env') });

describe("<Signin>", () => {
    it("Page should render", () => {
        const { container, debug } = render(
            <BrowserRouter>
                <Signin />
            </BrowserRouter>
        );
    });
    it("Input Validation: No input given", () => {
        const { container, debug } = render(
            <BrowserRouter>
                <Signin />
            </BrowserRouter>
        );
        expect(screen.getByText("Please provide a valid name")).toBeInTheDocument();
        // expect(screen.getByText("Your password must be atleast 8 characters, and must contain atleast one capital letter, one small letter and one number and one special character")).toBeInTheDocument();

    }
    )
    it("Input Validation: Correct input given", async () => {
        server.use(
            rest.post('http://127.0.0.1:8000/api/login/', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json({
                        ok: true,
                        error: "Invalid credentials"
                    }))
            }),
        )

        const { container, debug } = render(
            <BrowserRouter>
                <Signin />
                <Chat />
            </BrowserRouter>
        );
        console.log(`container ${container}`);
        const userNameInput = screen.getByPlaceholderText("Username");
        const passwordInput = screen.getByPlaceholderText("Password");

        fireEvent.change(userNameInput, { target: { value: "asd" } })
        fireEvent.change(passwordInput, { target: { value: "asdfQW!@34" } })
        const e = fireEvent.click(screen.getByText("Sign In"))
        const inp = await screen.findByPlaceholderText("Type here...");
        expect(inp).toBeInTheDocument();

    }
    )
    it("Network Error", async () => {
        server.use(
            rest.post('http://127.0.0.1:8000/api/login/', (req, res, ctx) => {
                console.log(req);
                return res(ctx.status(400))
            }),
        )
        const { container, debug, rerender } = render(
            <BrowserRouter>
                <Signin />
            </BrowserRouter>
        );
        const userNameInput = screen.getByPlaceholderText("Username");
        const passwordInput = screen.getByPlaceholderText("Password");

        userEvent.type(userNameInput, "asd")
        userEvent.type(passwordInput, "asdfQW!@34")

        userEvent.click(screen.getByText("Sign In"))

        const c = await screen.findByText(/Network Error!/i);
        expect(c).toBeInTheDocument();

    })

    it("Invalid credentials", async () => {
        server.use(
            rest.post('http://127.0.0.1:8000/api/login/', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json({
                        ok: false,
                        error: "Invalid credentials"
                    }))
            }),
        )
        const { container, debug, rerender } = render(
            <BrowserRouter>
                <Signin />
            </BrowserRouter>
        );
        const userNameInput = screen.getByPlaceholderText("Username");
        const passwordInput = screen.getByPlaceholderText("Password");

        userEvent.type(userNameInput, "asd")
        userEvent.type(passwordInput, "asdfQW!@34")

        userEvent.click(screen.getByText("Sign In"))

        const c = await screen.findByText(/You have entered wrong credentials/i);
        expect(c).toBeInTheDocument();

    })
    it("Redirect to Signup", () => {
        const { container, debug } = render(
            <BrowserRouter>
                <Signin />
                <SignUp />

            </BrowserRouter>
        );
        const e = fireEvent.click(screen.getByText("Sign Up"))
        expect(screen.getByText("Already have an account?")).toBeInTheDocument()

    });
});

