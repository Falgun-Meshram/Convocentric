import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import React from 'react';
import { setupServer } from 'msw/node';
import { response, rest } from 'msw'
import { BrowserRouter } from 'react-router-dom';

import Profile from '../components/Profile';
import Signin from '../components/Signin';

const server = setupServer(
    rest.put("http://127.0.0.1:8000/api/manage_user/1", (req, res, ctx) => {
        return res(
            ctx.status(204),
            ctx.json({
                ok: true,
                status: 204

            }))
    })
)
const user = '{ "id": 1, "password": "pbkdf2_sha256$320000$GQuoWffBrr1vLvXLgbTCd1$9cfnIcqpnq6B+02cp5AhlwvLaaCKLenulqK9/e4JxQ8=", "is_superuser": false, "is_staff": false, "is_active": true, "date_joined": "2022-03-17T16:12:04.037632Z", "first_name": "test", "last_name": "test", "email": "test1@test.com", "created_on": "2022-03-17T16:10:41.719550Z", "updated_on": "2022-03-17T16:10:41.719723Z", "profile_picture": "", "last_passwords": null, "locked": null, "last_login": "2022-03-31T18:44:50.351243Z", "username": "test1", "groups": [], "user_permissions": [] }'

beforeAll(() => {
    localStorage.setItem('user', user)
    server.listen()
})
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("<Profile>", () => {
    it("Page should render", async () => {
        const { container, debug } = render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );
        const userName = await screen.findAllByText("@test1")
        console.log(userName)
        expect(userName[0]).toBeInTheDocument();
        expect(container).toMatchSnapshot();

    });
    it("Profile firstname, last name and email validation", async () => {
        const { container, debug } = render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );

        const lastname = screen.getByPlaceholderText("Last name");
        const firstname = screen.getByPlaceholderText("First name");
        const email = screen.getByPlaceholderText("Enter your email");
        const input = screen.getByTestId("upload-input")
        const file = new File(['hello'], 'hello.png', { type: 'image/png' })

        userEvent.type(lastname, "81")
        userEvent.type(firstname, "test")
        await userEvent.upload(input, file)
        userEvent.click(screen.getByText("Save"))
        const c = await screen.findByText("User data saved successfully.");
        expect(c).toBeInTheDocument();

    }
    )
    it("Check the logged in user", async () => {
        const { container, debug } = render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );
        const firstname = await screen.findByDisplayValue("test1");
        expect(firstname).toBeInTheDocument();
    }
    )
    it("check the error  message", async () => {
        const { container, debug } = render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );
        const save_button = screen.getByText("Save");
        userEvent.click(screen.getByText("Save"))
        const c = await screen.findByText("You have not changed any values.")
        expect(c).toBeInTheDocument();
    }
    )


    it("Test logout function", async () => {
        server.use(
            rest.post('http://127.0.0.1:8000/api/logout', (req, res, ctx) => {
                return res({ 'ok': true })
            }),
        )
        const { container, debug } = render(
            <BrowserRouter>
                <Profile />
                <Signin />
            </BrowserRouter>
        );

        const log_out = screen.getByText("Logout");
        userEvent.click(log_out)
        const c = screen.getByText("Convocentric");
        expect(c).toBeInTheDocument();
    }
    );
    it("User update network fail", async () => {
        server.use(
            rest.put("http://127.0.0.1:8000/api/manage_user/1", (req, res, ctx) => {
                return res(
                    ctx.status(202),
                    ctx.json({
                        error: "Request Accepted",
                    }))
            })
        )
        const { container, debug } = render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );
        const lastname = screen.getByPlaceholderText("Last name");

        userEvent.type(lastname, "81")
        userEvent.click(screen.getByText("Save"))
        const c = await screen.findByText("Request Accepted")
        expect(c).toBeInTheDocument();
    }
    );

})

