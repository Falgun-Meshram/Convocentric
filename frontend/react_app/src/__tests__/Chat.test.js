import { findByText, logDOM, render, screen } from '@testing-library/react';
import React from 'react';
import WS from "jest-websocket-mock";
import { BrowserRouter } from 'react-router-dom';
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import userEvent from '@testing-library/user-event'

import Chat from '../components/Chat.js';
import Signin from '../components/Signin.js';

const users = [
    {
        "id": 2,
        "password": "pbkdf2_sha256$320000$rnXyDTY4AhL7NGSrHy6d3j$7zrGTTdvCK22JiGU1e/69rGMwNy685FMiCidspGD8vQ=",
        "is_superuser": false,
        "is_staff": false,
        "is_active": true,
        "date_joined": "2022-03-19T14:46:40.969221Z",
        "first_name": null,
        "last_name": null,
        "email": "test2@test.com",
        "created_on": "2022-03-19T14:46:13.826440Z",
        "updated_on": "2022-03-19T14:46:13.826604Z",
        "profile_picture": "",
        "last_passwords": null,
        "locked": null,
        "last_login": "2022-03-30T21:17:22.853672Z",
        "username": "test2",
        "groups": [],
        "user_permissions": [],
        "chatId": 57
    },
    {
        "id": 3,
        "password": "pbkdf2_sha256$320000$SkluxcGYO7MYsqVhbziugQ$D0wwuXYl8ChT+rlD+8mrz5h4hSzXRc1xD8z9GwzZCbY=",
        "is_superuser": false,
        "is_staff": false,
        "is_active": true,
        "date_joined": "2022-03-19T14:47:11.064674Z",
        "first_name": null,
        "last_name": null,
        "email": "test3@test.com",
        "created_on": "2022-03-19T14:46:13.826440Z",
        "updated_on": "2022-03-19T14:46:13.826604Z",
        "profile_picture": "",
        "last_passwords": null,
        "locked": null,
        "last_login": "2022-03-30T21:22:58.990181Z",
        "username": "test3",
        "groups": [],
        "user_permissions": [],
        "chatId": 58
    },
    {
        "id": 4,
        "password": "pbkdf2_sha256$320000$DGiiMoPooTZWHZjB1RvkBT$dDXg29G2sVaGrWo0ZElvkprDdIgYk05zHIm8vYuMDIs=",
        "is_superuser": false,
        "is_staff": false,
        "is_active": true,
        "date_joined": "2022-03-19T14:47:44.600081Z",
        "first_name": null,
        "last_name": null,
        "email": "test4@test.com",
        "created_on": "2022-03-19T14:46:13.826440Z",
        "updated_on": "2022-03-19T14:46:13.826604Z",
        "profile_picture": "",
        "last_passwords": null,
        "locked": null,
        "last_login": "2022-03-27T03:49:45.501579Z",
        "username": "test4",
        "groups": [],
        "user_permissions": [],
        "chatId": 59
    },
    {
        "id": 5,
        "password": "pbkdf2_sha256$320000$btWNeaNERYwMfvXejw2iDs$zVJAKh6uVYopRz7Xfnt24Rw0Jhwt8MI3C1r/d7qfp/Y=",
        "is_superuser": false,
        "is_staff": false,
        "is_active": true,
        "date_joined": "2022-03-19T14:47:59.921027Z",
        "first_name": null,
        "last_name": null,
        "email": "test5@test.com",
        "created_on": "2022-03-19T14:46:13.826440Z",
        "updated_on": "2022-03-19T14:46:13.826604Z",
        "profile_picture": "",
        "last_passwords": null,
        "locked": null,
        "last_login": null,
        "username": "test5",
        "groups": [],
        "user_permissions": [],
        "chatId": 60
    }
]

const apiServer = setupServer(
    rest.get("http://127.0.0.1:8000/api/get_all_users", (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                users
            }))
    })
)
beforeAll(() => {
    localStorage.setItem('user', user)
    localStorage.setItem('chatMessagesDict', chatDict)
    localStorage.setItem('currentChatId', 57)
    localStorage.setItem('token', 'c1be8457974aea8f4dff23cce26f435e0b32457d')
    apiServer.listen()
})
afterEach(() => {
    apiServer.resetHandlers()
    localStorage.setItem('user', user)
    localStorage.setItem('chatMessagesDict', chatDict)
    localStorage.setItem('currentChatId', 57)
    localStorage.setItem('token', 'c1be8457974aea8f4dff23cce26f435e0b32457d')
})
afterAll(() => apiServer.close())

const user = '{ "id": 1, "password": "pbkdf2_sha256$320000$GQuoWffBrr1vLvXLgbTCd1$9cfnIcqpnq6B+02cp5AhlwvLaaCKLenulqK9/e4JxQ8=", "is_superuser": false, "is_staff": false, "is_active": true, "date_joined": "2022-03-17T16:12:04.037632Z", "first_name": null, "last_name": null, "email": "test1@test.com", "created_on": "2022-03-17T16:10:41.719550Z", "updated_on": "2022-03-17T16:10:41.719723Z", "profile_picture": "", "last_passwords": null, "locked": null, "last_login": "2022-03-31T18:44:50.351243Z", "username": "test1", "groups": [], "user_permissions": [] }'

const chatDict = '[{"57": [{"id": 209,"chat_id": 57,"author": "test1","author_id": 1,"content": "looking","timestamp": "2022-04-02 18:02:46.014919+00:00"}]}]'

let sampleMessages = [
    {
        "id": 175,
        "chat_id": 57,
        "author": "test2",
        "author_id": 2,
        "content": "same here",
        "timestamp": "2022-03-30 21:17:13.389861+00:00"
    },
    {
        "id": 174,
        "chat_id": 57,
        "author": "test1",
        "author_id": 1,
        "content": "nothing much",
        "timestamp": "2022-03-30 21:16:34.639030+00:00"
    },
    {
        "id": 173,
        "chat_id": 57,
        "author": "test2",
        "author_id": 2,
        "content": "so whats new",
        "timestamp": "2022-03-30 21:12:36.175457+00:00"
    },
    {
        "id": 172,
        "chat_id": 57,
        "author": "test2",
        "author_id": 2,
        "content": "right",
        "timestamp": "2022-03-30 21:09:23.841407+00:00"
    },
    {
        "id": 171,
        "chat_id": 57,
        "author": "test1",
        "author_id": 1,
        "content": "netflix",
        "timestamp": "2022-03-30 21:02:08.916291+00:00"
    },
    {
        "id": 170,
        "chat_id": 57,
        "author": "test1",
        "author_id": 1,
        "content": "on",
        "timestamp": "2022-03-30 21:01:47.699318+00:00"
    },
    {
        "id": 169,
        "chat_id": 57,
        "author": "test1",
        "author_id": 1,
        "content": "continues",
        "timestamp": "2022-03-30 21:01:01.772589+00:00"
    },
    {
        "id": 168,
        "chat_id": 57,
        "author": "test1",
        "author_id": 1,
        "content": "saga",
        "timestamp": "2022-03-30 20:58:41.665247+00:00"
    },
    {
        "id": 167,
        "chat_id": 57,
        "author": "test1",
        "author_id": 1,
        "content": "witcher",
        "timestamp": "2022-03-30 20:55:16.146565+00:00"
    },
    {
        "id": 166,
        "chat_id": 57,
        "author": "test1",
        "author_id": 1,
        "content": "joke",
        "timestamp": "2022-03-30 20:51:31.177077+00:00"
    }
]

it("Get all users", async () => {
    const websocketServer = new WS("ws://127.0.0.1:8000/ws/chat/");
    const client = new WebSocket("ws://127.0.0.1:8000/ws/chat/")
    await websocketServer.connected;
    const { container, debug, rerender } = render(
        <BrowserRouter>
            <Chat />
        </BrowserRouter>
    );
    const listItem = await screen.findByText("test2");
    expect(listItem).toBeInTheDocument();
    websocketServer.close()
    client.close()
    expect(container).toMatchSnapshot();
});
it("Check user is online", async () => {
    const { container, debug, rerender } = render(
        <BrowserRouter>
            <Chat />
        </BrowserRouter>
    );
    const websocketServer = new WS("ws://127.0.0.1:8000/ws/chat/");
    const client = new WebSocket("ws://127.0.0.1:8000/ws/chat/")
    await websocketServer.connected;
    const prevUser = await screen.findByText("test2")
    websocketServer.send(JSON.stringify({
        'command': 'is_online',
        'message': {
            "status": true,
            'userId': 4
        }
    }))
    websocketServer.send(JSON.stringify({
        'command': 'is_online',
        'message': {
            "status": true,
            'userId': 3
        }
    }))
    const onlineUser2 = await screen.findByText("test4 🟢");
    expect(onlineUser2).toBeInTheDocument();

    const onlineUser3 = await screen.findByText("test3 🟢");
    expect(onlineUser3).toBeInTheDocument();
    websocketServer.close();
    client.close()
})
it("Get old messages", async () => {
    const { container, debug, rerender } = render(
        <BrowserRouter>
            <Chat />
        </BrowserRouter>
    );
    const websocketServer = new WS("ws://127.0.0.1:8000/ws/chat/");
    const client = new WebSocket("ws://127.0.0.1:8000/ws/chat/")

    await websocketServer.connected;
    websocketServer.send(JSON.stringify({
        'command': 'messages',
        'isCreated': false,
        'messages': {
            'fetched_messages': sampleMessages,
            'chat_id': 57,
            'recieverId': 2,
            'senderId': 1
        }
    }))
    const user = await screen.findAllByText("test2")
    userEvent.click(user[0])
    const textMessage = await screen.findByText('same here')
    expect(textMessage).toBeInTheDocument();

    websocketServer.close();
    client.close()
})

it("Send messages", async () => {
    const { container, debug, rerender } = render(
        <BrowserRouter>
            <Chat />
        </BrowserRouter>
    );
    const websocketServer = new WS("ws://127.0.0.1:8000/ws/chat/");
    const client = new WebSocket("ws://127.0.0.1:8000/ws/chat/")

    await websocketServer.connected;
    // const user = await screen.findAllByText('test2')
    // userEvent.click(user[0])
    const input = screen.getByPlaceholderText("Type here...");
    userEvent.type(input, "Hello, how are you?");
    userEvent.keyboard("{Enter}")
    websocketServer.send(JSON.stringify({
        'command': 'new_message',
        'message': {
            "id": 175,
            "chat_id": 57,
            "author": "test2",
            "author_id": 2,
            "content": "Hello, how are you?",
            "timestamp": "2022-03-30 21:17:13.389861+00:00"
        },
    }))
    const text = await screen.findAllByText("Hello, how are you?")
    expect(input.value).toBe("")
    expect(text[0]).toBeInTheDocument()

    websocketServer.close();
    client.close()
})
it("Recieve messages", async () => {
    const { container, debug, rerender } = render(
        <BrowserRouter>
            <Chat />
        </BrowserRouter>
    );
    const websocketServer = new WS("ws://127.0.0.1:8000/ws/chat/");
    const client = new WebSocket("ws://127.0.0.1:8000/ws/chat/")

    await websocketServer.connected;
    // const user = await screen.findAllByText('test2')
    // userEvent.click(user[0])
    userEvent.keyboard("{Enter}")
    websocketServer.send(JSON.stringify({
        'command': 'new_message',
        'message': {
            "id": 175,
            "chat_id": 57,
            "author": "test2",
            "author_id": 2,
            "content": "Hello, how are you?",
            "timestamp": "2022-03-30 21:17:13.389861+00:00"
        },
    }))
    const text = await screen.findAllByText("Hello, how are you?")
    expect(text[0]).toBeInTheDocument()
    websocketServer.close();
    client.close()
})
it("Logout", async () => {
    apiServer.use(
        rest.post('http://127.0.0.1:8000/api/logout', (req, res, ctx) => {
            return res({ 'ok': true })
        }),
    )
    const { container, debug, rerender } = render(
        <BrowserRouter>
            <Chat />
            <Signin />
        </BrowserRouter>
    );
    const websocketServer = new WS("ws://127.0.0.1:8000/ws/chat/");
    const client = new WebSocket("ws://127.0.0.1:8000/ws/chat/")

    await websocketServer.connected;
    userEvent.click(screen.getByTestId("dropdown"))
    const log_out = screen.getByTestId("logoutDropdown");
    userEvent.click(log_out)
    const c = screen.getByText("Convocentric");
    expect(c).toBeInTheDocument();

    websocketServer.close();
    client.close()

})

