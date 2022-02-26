// import logo from '../logo.svg';
import React from 'react';
import { Col, Container, Row, Dropdown, InputGroup, DropdownButton, FormControl } from 'react-bootstrap';
import { ChatList, Input, Button, MessageList, } from 'react-chat-elements';

import '../css/App.css';
import 'react-chat-elements/dist/main.css';
import { useState } from 'react';

// const ws = new WebSocket("wss://ws.bitstamp.net");
// const apiCall = {
//   event: "bts:subscribe",
//   data: { channel: "order_book_btcusd" },
// };

// ws.onopen = (event) => {
//   console.log(`ws.onopen `);
//   console.log(event);
//   ws.send(JSON.stringify(apiCall));
// };

function App() {
  const date = new Date();
  const data = [
    {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
      id: '123'
    }, {
      avatar: 'https://facebook.github.io/react/img/logo.svg',
      alt: 'Reactjs',
      title: 'Facebook',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: 0,
      id: '456'
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


  // ws.onmessage = function (event) {
  //   const json = JSON.parse(event.data);
  //   console.log(`[message] Data received from server: ${json}`);
  //   try {
  //     if ((json.event = "data")) {

  //       console.log(json.data.timestamp);
  //     }
  //   } catch (err) {
  //     //whatever you wish to do with the err
  //   }

  // };

  // const [userMessage, changeUserMessage] = useState("");
  let userMessage = ""
  const [currentGroupId, changeGroupId] = useState("");
  const handleOnChange = (e) => {
    // changeUserMessage(e.target.value)
    userMessage = e.target.value;
  };
  const handleGroupClick = (group) => {
    console.log(group);
    changeGroupId(group.id)
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
      <Row style={{ height: '100vh' }}>
        <Col lg="5" style={{ height: '100vh', }}  >
          <div style={{ height: '5vh' }}>
            Profile Data
          </div>
          <ChatList
            className="chat-list"
            onClick={handleGroupClick}
            dataSource={data}
          />
        </Col>
        <Col lg="7" style={{ height: '100vh', background: 'aliceBlue' }} >
          <div style={{ height: '5vh' }}>
            Group Data
          </div>
          <div style={{ height: '85vh' }} className='message-list' >
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

export default App;
