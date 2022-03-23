
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
  const navigate = useNavigate();
  const [currUser, setCurrUser] = useState({});
  const [userList, setUserList] = useState([{
    avatar: 'https://facebook.github.io/react/img/logo.svg',
    alt: 'Reactjs',
    title: 'Facebook',
    subtitle: 'What are you doing?',
    date: new Date(),
    unread: 0,
    id: '1'
  }]);
  console.log(userList);
  useEffect(() => {
    let user = {};
    if (localStorage.getItem('user')) {
      user = JSON.parse(localStorage.getItem('user'));
    }
    const options = {
      method: "GET",
      url: "/get_all_users"
    }
    let dat = [];
    axiosInstance.request(options).then((res) => {
      res.data.users.map((item) =>
        user.id !== item.id ? dat.push({
          title: item.username,
          id: String(item.id),
          avatar: 'https://facebook.github.io/react/img/logo.svg',
          alt: 'Reactjs',
          subtitle: 'What are you doing?',
          date: new Date(),
          unread: 0,
        }) : ""
      )
      setUserList(dat);
    }).catch((err) => { console.log(err); })
    setCurrUser(user);
  }, [])

  const initializeChat = (chatId, message) => {

    // message needs to have senderId and recieverId
    waitForSocketConnection(() => {
      WebSocketInstance.fetchMessages(
        chatId,
        message
      );
    });
    WebSocketInstance.connect(currUser.id, null);
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

  // const [userMessage, changeUserMessage] = useState("");
  let userMessage = ""
  const [currentGroupId, changeGroupId] = useState("");
  const handleOnChange = (e) => {
    // changeUserMessage(e.target.value)
    userMessage = e.target.value;
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

    // Define message object which has senderId and receiverId
    console.log(group);
    const chatId = group.chatId;
    let messages = { senderId: currUser.id, recieverId: group.id };
    initializeChat(chatId, messages);
    console.log(group);
  };
  const handleSubmit = (e) => {
    console.log(`handlesubmit called`);
    console.log(userMessage);
  };
  const handleReply = () => {
    console.log('natural');

  }


  const getUserMessages = (groupId) => {
    console.log(`getUserMessages : ${groupId}`);
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
                <Dropdown.Item>Logout</Dropdown.Item>
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
          <div style={{ height: '82vh' }} className='message-list' >
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
