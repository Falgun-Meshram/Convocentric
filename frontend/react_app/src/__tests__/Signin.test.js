import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from '../components/App';
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import Signin from '../components/Signin';
// import SignUp from '../components/Signup';

const server = setupServer(
    rest.post("http://25ab-2607-fea8-1c80-7f7-55ce-adce-4c03-481e.ngrok.io/api/login", (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                ok: true,
                error: ""
            }))
    })
)

beforeAll(() => server.listen())
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
        expect(screen.getByText("Please provide a valid email")).toBeInTheDocument();
        expect(screen.getByText("Your password must be atleast 8 characters, and must contain atleast one capital letter, one small letter and one number and one special character")).toBeInTheDocument();
        expect(screen.getByText("Password should match")).toBeInTheDocument();
    }
    )
    //TODO Add a network error test case
    it("Network Error", async () => {
        server.use(
            rest.post('http://25ab-2607-fea8-1c80-7f7-55ce-adce-4c03-481e.ngrok.io/api/login/', (req, res, ctx) => {
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

        userEvent.click(screen.getByText("Sign in"))

        const c = await screen.findByText(/Network Error/i);
        expect(c).toBeInTheDocument();

    })

    it("Invalid credentials", async () => {
        server.use(
            rest.post('http://25ab-2607-fea8-1c80-7f7-55ce-adce-4c03-481e.ngrok.io/api/login/', (req, res, ctx) => {
                return res(
                    ctx.status(200),
                    ctx.json({
                        ok: false,
                        error:"Invalid credentials"
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

        userEvent.click(screen.getByText("Sign in"))

        const c = await screen.findByText(/You have entered wrong credentials/i);
        expect(c).toBeInTheDocument();

    })
    // it("Input Validation: Correct input given", () => {

    //     //TODO Add the msw to mock the api calls
    //     const { container, debug } = render(
    //         <BrowserRouter>
    //             <Signin />
    //             <App />
    //         </BrowserRouter>
    //     );
    //     console.log(`container ${container}`);
    //     const userNameInput = screen.getByPlaceholderText("Username");
    //     const passwordInput = screen.getByPlaceholderText("Password");

    //     fireEvent.change(userNameInput, { target: { value: "asd" } })
    //     fireEvent.change(passwordInput, { target: { value: "asdfQW!@34" } })
    //     const e = fireEvent.click(screen.getByText("Sign Up"))
    //     expect(screen.getByText("Profile Data")).toBeInTheDocument();

    // }
    // )
    // it("Redirect to Signup", () => {
    //     const { container, debug } = render(
    //         <BrowserRouter>
    //             <Signin />
    //             <SignUp />

    //         </BrowserRouter>
    //     );
    //     const e = fireEvent.click(screen.getByText("Sign Up"))
    //     expect(screen.getByText("Already have an account?")).toBeInTheDocument()

    // }
    // )
});

