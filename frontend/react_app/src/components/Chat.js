
// import logo from '../logo.svg';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { Col, Container, Row, Dropdown, InputGroup, DropdownButton, FormControl, Image } from 'react-bootstrap';
import { ChatList, Input, Button, MessageList, } from 'react-chat-elements';
import { useNavigate, useLocation } from 'react-router-dom';

import WebSocketInstance from "./Socket";
import axiosInstance from './axiosInstance';
import '../css/App.css';
import 'react-chat-elements/dist/main.css';
import { rest } from 'msw';

function Chat() {

  const location = useLocation();
  const date = new Date();
  const test = "hey"
  const navigate = useNavigate();
  const [currUser, setCurrUser] = useState({});
  const [chatMessagesDict, setChatMessagesDict] = useState({});

  const [userMessage, setUserMessage] = useState("");
  const [currentGroupId, setGroupid] = useState({
    id: 2,
  });

  const [userList, setUserList] = useState([{
    avatar: 'https://facebook.github.io/react/img/logo.svg',
    alt: 'Reactjs',
    title: 'Facebook',
    subtitle: 'What are you doing?',
    date: new Date(),
    unread: 0,
    id: '1'
  }]);
  const getChatMessageDict = () => { return chatMessagesDict }
  const getUsers = () => { return userList }

  useEffect(() => {
    initWebsocket();
    let user = {};
    if (localStorage.getItem('user')) {
      user = JSON.parse(localStorage.getItem('user'));
    }
    setCurrUser(user);
    getAllUsers();
  }, [])
  useEffect(() => {
    console.log('updated chatmessages');
    console.log(chatMessagesDict);
    WebSocketInstance.addCallbacks(
      (data) => setMessagesCallback(data, getChatMessageDict),
      (data) => addMessageCallback(data, getChatMessageDict, getUsers),
    )

  }, [chatMessagesDict, userList])
  const getAllUsers = () => {
    const options = {
      method: "GET",
      url: "/get_all_users"
    }
    let data = [];
    axiosInstance.request(options).then((res) => {
      res.data.users.map((item) => {
        data.push({
          title: `${item.username === 'test2' ? `${item.username} 🟢` : `${item.username}`} `,
          id: String(item.id),
          avatar: 'https://facebook.github.io/react/img/logo.svg',
          alt: 'Reactjs',
          subtitle: 'What are you doing?',
          date: new Date(),
          unread: 0,
          chatId: 18
        })
      }
      )
      setUserList(data);
    }).catch((err) => {
      console.log(err);
    })
  }


  const initWebsocket = () => {
    if (WebSocketInstance.readyState === 1) {
      // pass
      console.log('pass');
    } else {
      console.log('connecting');
      WebSocketInstance.addCallbacks(
        (data) => setMessagesCallback(data, getChatMessageDict),
        (data) => addMessageCallback(data, getChatMessageDict, getUsers),
      )
      WebSocketInstance.connect();
    }
  }


  const initializeChat = (chatId, message) => {
    // message needs to have senderId and recieverId
    let date = new Date()
    waitForSocketConnection(() => {

      WebSocketInstance.addCallbacks(
        (data) => setMessagesCallback(data, getChatMessageDict),
        (data) => addMessageCallback(data, getChatMessageDict, getUsers),
      )
      WebSocketInstance.fetchMessages(
        chatId,
        message
      );

    });
  }

  const newMessageSocketInit = (chatId, msg, senderId, recieverId) => {
    // message needs to have senderId and recieverId
    let date = new Date()
    let message = {
      'content': msg,
      'chatId': chatId,
      'senderId': senderId,
      'recieverId': recieverId
    }

    waitForSocketConnection(() => {

      WebSocketInstance.addCallbacks(
        (data) => setMessagesCallback(data, getChatMessageDict),
        (data) => addMessageCallback(data, getChatMessageDict, getUsers),
      )
      WebSocketInstance.newChatMessage(
        message
      );
    });
  }

  const setMessagesCallback = (data, chatMessages) => {
    console.log(data)
    let selectedUserId = data.selected_user_id;
    userList.find((item, i) => {
      if (item.id == selectedUserId) {
        item.chatId = data.chat_id;
      }
    });
    let temp = { ...chatMessagesDict };
    let temp2 = chatMessages()
    console.log(temp2)
    console.log(temp);
    // console.log(new Date());
    temp[data.chat_id] = data.fetched_messages;
    console.log(temp);
    // TODO set time here and use useeffect to see when it updates
    setChatMessagesDict(temp);
    // setUserList(userList);
  }

  const addMessageCallback = (data, chatMessages, getUsers) => {
    console.log(data)
    console.log(getUsers());
    userList.map((item) => { if (item.chatId == data.chat_id) item.unread += 1 })
    // TODO Check if chat id does not exits
    let messageList = chatMessages();
    let message = { ...chatMessagesDict }
    console.log(date);
    console.log(messageList);
    console.log(message);
    let temp = messageList[data.chat_id] ? messageList[data.chat_id] : [];;
    // console.log(temp);
    temp.push(data);
    messageList[data.chat_id] = temp
    // let o = { ...chatMessagesDict, [data.chat_id]: temp }
    console.log(messageList);
    //! Why spread operator immediately updates the state variable
    setChatMessagesDict({ ...messageList, [data.chat_id]: temp })
  }

  const waitForSocketConnection = (callback) => {
    setTimeout(function () {
      if (WebSocketInstance.state() === 1) {
        console.log('calling back');
        callback();
        return;
      } else {
        console.log("wait for connection...");
        waitForSocketConnection(callback);
      }
    }, 100);
  }


  const msg = [
    {
      position: 'right',
      type: 'text',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      date: date.setDate(date.getDate() - 4),
    },
    {
      position: 'left',
      type: 'text',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      date: new Date(),
    },
    {
      position: 'right',
      type: 'text',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      date: new Date(),
    }, {
      position: 'right',
      type: 'text',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      date: new Date(),
    },
    {
      position: 'left',
      type: 'text',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      date: new Date() - 10,
    },
    {
      position: 'right',
      type: 'text',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      date: new Date(),
    }, {
      position: 'right',
      type: 'text',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      date: new Date(),
    },
    {
      position: 'left',
      type: 'text',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      date: new Date() - 10,
    }, {
      position: 'right',
      type: 'text',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      date: new Date(),
    },
    {
      position: 'left',
      type: 'text',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      date: new Date() - 10,
    },
    {
      position: 'right',
      type: 'text',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      date: new Date(),
    },
    {
      position: 'right',
      type: 'text',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      date: new Date(),
    },
    {
      position: 'left',
      type: 'text',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      date: new Date() - 10,
    },
    {
      position: 'right',
      type: 'text',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      date: new Date(),
    }, {
      position: 'right',
      type: 'text',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      date: new Date(),
    },
    {
      position: 'left',
      type: 'text',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      date: new Date() - 10,
    },
    {
      position: 'right',
      type: 'text',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      date: new Date(),
    }, {
      position: 'right',
      type: 'text',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      date: new Date(),
    },
    {
      position: 'left',
      type: 'text',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      date: new Date() - 10,
    },
    {
      position: 'right',
      type: 'text',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      date: new Date(),
    }, {
      position: 'right',
      type: 'text',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      date: new Date(),
    },
    {
      position: 'left',
      type: 'text',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      date: new Date() - 10,
    },
    {
      position: 'right',
      type: 'text',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      date: new Date(),
    },
  ]
  const simpleMsg = [{
    position: 'right',
    type: 'text',
    text: 'Hey',
    date: date.setDate(date.getDate() - 4),
    replyButton: true,


  },
  {
    position: 'left',
    type: 'text',
    text: 'I am doing well',
    date: new Date(),
    replyButton: true,


  },]



  const handleOnChange = (e) => {
    setUserMessage(e.target.value);
  };

  const data = [
    {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
      id: '1'
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
      id: '2'
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    },
    {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
    },
  ]

  const handleGroupClick = (group) => {
    setGroupid({ id: group.id })
    // Define message object which has senderId and receiverId
    const chatId = group.chatId;
    let messages = { senderId: currUser.id, recieverId: group.id };
    initializeChat(chatId, messages);
    console.log(group);
  };
  const redirectPage = (page) => {
    navigate(page)
  }
  const handleLogout = () => {
    axiosInstance.get("logout/").then((response) => {
      if (response.data.ok) {
        localStorage.removeItem("isAuth");
        localStorage.removeItem("user");
        redirectPage('/');
      } else {
        console.log("Error");
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  const handleSubmit = (e) => {
    // currChatId, message, senderId, recieverId
    console.log(currentGroupId);
    let chatId = 0
    userList.map((item) => { if (item.id == currentGroupId.id) { chatId = item.chatId } })
    console.log(chatId);
    console.log(currUser.id);
    newMessageSocketInit(chatId, userMessage, currUser.id, currentGroupId.id);
    console.log(`handlesubmit called`);
    console.log(userMessage);
  };
  const handleReply = () => {
    console.log('natural');

  }

  const getUserMessages = (groupId) => {
    // console.log(`getUserMessages : ${groupId}`);
    if (groupId === "123")
      return msg;
    if (groupId === "456")
      return simpleMsg;
    else
      return [];
  };
  return (
    <Container fluid style={{ height: '100vh' }} >
      <Row style={{ height: '100vh' }} >
        <Col lg="5" style={{ height: '100vh', }}  >
          <div div style={{ height: '7vh' }} className='navBar'>
            <Image roundedCircle src='https://picsum.photos/200' style={{ 'width': '8%' }} />
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>New Group</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                <Dropdown.Item href='/profile' >Settings</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <ChatList
            className="chat-list"
            onClick={handleGroupClick}
            dataSource={userList}
          />
        </Col>
        <Col lg="7" style={{ height: '100vh', background: 'aliceBlue' }} >
          <div style={{ height: '7vh' }}>
            Group Data
          </div>
          <div style={{ height: '82vh' }} className='message-list'>
            <MessageList
              className="message-list"
              lockable
              toBottomHeight="100%"
              dataSource={getUserMessages(currentGroupId)}
              onReplyClick={handleReply}
            />
            <Dropdown
              buttonProps={{
                text: 'Dropdown',
              }}
              items={[
                {
                  text: 'dolor'
                },
              ]} />
          </div>

          <div className='input'>
            <Input
              placeholder="Type here..."
              multiline={true}
              onChange={handleOnChange}
              rightButtons={
                <Button
                  onClick={handleSubmit}
                  color='white'
                  backgroundColor='black'
                  text='Send' />
              }
            />
          </div>
        </Col>
      </Row>
    </Container >
  );
}

export default Chat;
