import { render, fireEvent, screen, waitFor, } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import SignUp from '../components/Signup';
import Signin from '../components/Signin';

const server = setupServer(
    rest.post("http://127.0.0.1:8000/api/signup", (req, res, ctx) => {
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


it("Page should render", () => {
    const { container, debug } = render(
        <BrowserRouter>
            <SignUp />
        </BrowserRouter>
    );
    expect(container).toMatchSnapshot();
});
it("Input Validation: No input given", async () => {
    const { container, debug } = render(
        <BrowserRouter>
            <SignUp />
        </BrowserRouter>
    );
    const e = userEvent.click(screen.getByText("Sign Up"))
    expect(screen.getByText("Please provide a valid name")).toBeInTheDocument();
    expect(screen.getByText("Please provide a valid email")).toBeInTheDocument();
    expect(screen.getByText("Your password must be atleast 8 characters, and must contain atleast one capital letter, one small letter and one number and one special character")).toBeInTheDocument();
    expect(screen.getByText("Password should match")).toBeInTheDocument();
}
)
it("Network Error", async () => {
    server.use(
        rest.post('http://127.0.0.1:8000/api/signup', (req, res, ctx) => {
            return res(ctx.status(400))
        }),
    )
    const { container, debug, rerender } = render(
        <BrowserRouter>
            <SignUp />
        </BrowserRouter>
    );
    const userNameInput = screen.getByPlaceholderText("Enter an username");
    const emailInput = screen.getByPlaceholderText("name@example.com");
    const passwordInput = screen.getByPlaceholderText("Enter a password");
    const confirmInput = screen.getByPlaceholderText("Confirm password");

    userEvent.type(userNameInput, "asd")
    userEvent.type(emailInput, "na@ex.com")
    userEvent.type(passwordInput, "asdfQW!@34")
    userEvent.type(confirmInput, "asdfQW!@34")

    userEvent.click(screen.getByText("Sign Up"))

    const c = await screen.findByText(/Network Error/i);
    expect(c).toBeInTheDocument();

})
it("Username exists already", async () => {
    server.use(
        rest.post('http://127.0.0.1:8000/api/signup', (req, res, ctx) => {
            return res(
                ctx.status(200),
                ctx.json({
                    ok: false,
                    error: {
                        username: "Username exists already"
                    }
                }))
        }),
    )
    const { container, debug, rerender } = render(
        <BrowserRouter>
            <SignUp />
        </BrowserRouter>
    );
    const userNameInput = screen.getByPlaceholderText("Enter an username");
    const emailInput = screen.getByPlaceholderText("name@example.com");
    const passwordInput = screen.getByPlaceholderText("Enter a password");
    const confirmInput = screen.getByPlaceholderText("Confirm password");

    userEvent.type(userNameInput, "asd")
    userEvent.type(emailInput, "na@ex.com")
    userEvent.type(passwordInput, "asdfQW!@34")
    userEvent.type(confirmInput, "asdfQW!@34")

    userEvent.click(screen.getByText("Sign Up"))

    const c = await screen.findByText(/UserName exists already/i);
    expect(c).toBeInTheDocument();

})
it("Email exists already", async () => {
    server.use(
        rest.post('http://127.0.0.1:8000/api/signup', (req, res, ctx) => {
            return res(
                ctx.status(200),
                ctx.json({
                    ok: false,
                    error: {
                        email: "email exists already"
                    }
                }))
        }),
    )
    const { container, debug, rerender } = render(
        <BrowserRouter>
            <SignUp />
        </BrowserRouter>
    );
    const userNameInput = screen.getByPlaceholderText("Enter an username");
    const emailInput = screen.getByPlaceholderText("name@example.com");
    const passwordInput = screen.getByPlaceholderText("Enter a password");
    const confirmInput = screen.getByPlaceholderText("Confirm password");

    userEvent.type(userNameInput, "asd")
    userEvent.type(emailInput, "na@ex.com")
    userEvent.type(passwordInput, "asdfQW!@34")
    userEvent.type(confirmInput, "asdfQW!@34")

    userEvent.click(screen.getByText("Sign Up"))

    const c = await screen.findByText(/Email exists already/i);
    expect(c).toBeInTheDocument();

})
it("Input Validation: Correct input given", async () => {
    const { container, debug, rerender } = render(
        <BrowserRouter>
            <SignUp />
        </BrowserRouter>
    );
    const userNameInput = screen.getByPlaceholderText("Enter an username");
    const emailInput = screen.getByPlaceholderText("name@example.com");
    const passwordInput = screen.getByPlaceholderText("Enter a password");
    const confirmInput = screen.getByPlaceholderText("Confirm password");

    userEvent.type(userNameInput, "asd")
    userEvent.type(emailInput, "na@ex.com")
    userEvent.type(passwordInput, "asdfQW!@34")
    userEvent.type(confirmInput, "asdfQW!@34")

    userEvent.click(screen.getByText("Sign Up"))

    const c = await screen.findByText("Sign Up Successfull");
    expect(c).toBeInTheDocument();

}
)
it("Redirect to Login", async () => {
    const { container, debug } = render(
        <BrowserRouter>
            <SignUp />
            <Signin />
        </BrowserRouter>
    );
    const signin = await screen.getAllByText("Sign In")[0]
    const e = userEvent.click(signin)
    expect(screen.getByText("Create an account")).toBeInTheDocument()

}
)


