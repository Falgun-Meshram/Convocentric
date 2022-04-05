
// import logo from '../logo.svg';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { Col, Container, Row, Dropdown, InputGroup, DropdownButton, FormControl, Image, Button as ReactButton } from 'react-bootstrap';
import { ChatList, Input, Button, MessageList, } from 'react-chat-elements';
import { useNavigate, useLocation } from 'react-router-dom';
import WebSocketInstance from "./Socket";
import axiosInstance from './axiosInstance';
import '../css/App.css';
import '../css/Chat.css';
import 'react-chat-elements/dist/main.css';

function Chat() {

  const location = useLocation();
  const date = new Date();
  const navigate = useNavigate();
  const [currUser, setCurrUser] = useState({});
  // const [chatMessagesDict, setChatMessagesDict] = useState({});

  const [userMessage, setUserMessage] = useState("");
  const [deletedMsg, setDeletedMsg] = useState("");
  const [currentChatId, setChatId] = useState({
    id: "",
  });
  const [dummy, setDummy] = useState("");

  const userList = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
  // console.log(userList);;
  const getChatMessageDict = () => { return '' }
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
    let div = document.getElementById('messageDiv')
    div.scrollTop = div.scrollHeight;
    console.log('dummy');
  }, [dummy])
  const getAllUsers = async () => {
    const options = {
      method: "GET",
      url: "/get_all_users"
    }
    let onlineUserDict = localStorage.getItem('onlineUserDict') ? JSON.parse(localStorage.getItem('onlineUserDict')) : {};
    try {
      // console.log(axiosInstance.request(options));

      // console.log(localStorage.getItem("user"));
      const res = await axiosInstance.request(options);
      console.log('should reach here');
      let data = [];
      let currentChatIds = [];
      let chatUserDict = [];

      res.data.users.map((item) => {
        if (item.chatId) {
          currentChatIds.push(item.chatId);
          chatUserDict.push({ 'userId': item.id, 'chatId': item.chatId ? item.chatId : 0 });
        }
        data.push({
          title: onlineUserDict[item.id] ? `${item.username} 🟢` : `${item.username.replaceAll("🟢", "")}`,
          id: String(item.id),
          avatar: 'https://facebook.github.io/react/img/logo.svg',
          alt: 'Reactjs',
          subtitle: 'What are you doing?',
          date: new Date(),
          unread: 0,
          chatId: item['chatId'] ? item['chatId'] : 0
        })

      })
      // console.log(data);
      localStorage.setItem('users', JSON.stringify(data));
      localStorage.setItem('chatUserDict', JSON.stringify(chatUserDict));
      let currentPath = window.location.href.split('/');
      let currentChatId = currentPath.length > 4 ? currentPath[4] : null;
      setDummy(new Date())
      if (currentChatIds.includes(currentChatId)) {
        redirectPage("/chat/" + data.chat_id);
        // window.history.replaceState(null, "Chat Room", "/chat/"+data.chat_id);
      } else {
        redirectPage("/chat");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const initOnline = (status) => {
    //! This works only if all users are currently logged
    console.log('called');
    let userObj = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : [];
    let onlineObj = { 'userId': userObj.id, 'status': status };
    let onlineUserDict = localStorage.getItem('onlineUserDict') ? JSON.parse(localStorage.getItem('onlineUserDict')) : {};
    onlineUserDict[userObj.id] = status;
    localStorage.setItem('onlineUserDict', JSON.stringify(onlineUserDict));
    waitForSocketConnection(() => {
      WebSocketInstance.chatCallbacks(
        (data) => setMessagesCallback(data),
        (data) => addMessageCallback(data, 1, getUsers),
        (data) => isOnlineCallback(data)
      )
      WebSocketInstance.isOnline(
        onlineObj
      );
    });

  }

  const initWebsocket = (chatId, message, status) => {
    if (WebSocketInstance.readyState === 1) {
    } else {
      if (!status) {
        WebSocketInstance.chatCallbacks(
          (data) => setMessagesCallback(data),
          (data) => addMessageCallback(data, 2, getUsers),
          (data) => isOnlineCallback(data)
        )
        initOnline(true);
      } else {
        waitForSocketConnection(() => {
          WebSocketInstance.chatCallbacks(
            (data) => setMessagesCallback(data),
            (data) => addMessageCallback(data, 3, getUsers),
            (data) => isOnlineCallback(data)
          )
          WebSocketInstance.fetchMessages(
            chatId,
            message
          );
        });
      }
      WebSocketInstance.connect(chatId);
    }
  }

  const initializeChat = (chatId, message) => {
    // message needs to have senderId and recieverId
    let date = new Date();
    initWebsocket(chatId, message, true);
  }

  const handleConversationClick = (chat) => {
    let recieverId = parseInt(chat.id);
    let currentClickedChatId = parseInt(chat.chatId);
    let currUserObj = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : [];
    let currChatUserDict = localStorage.getItem('chatUserDict') ? JSON.parse(localStorage.getItem('chatUserDict')) : [];
    let existingChatId = 0;
    localStorage.setItem("reciever", recieverId.toString())
    currChatUserDict.map(item => {
      if (item.chatId == currentClickedChatId) {
        existingChatId = item.chatId;
      }
    })
    // setChatId({ id: chat.id });    
    // Define message object which has senderId and receiverId
    let messages = { senderId: currUserObj.id, recieverId: recieverId };
    console.log(currentClickedChatId, messages);
    initializeChat(currentClickedChatId, messages);
  };

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
      WebSocketInstance.chatCallbacks(
        (data) => setMessagesCallback(data),
        (data) => addMessageCallback(data, 4),
      )
      WebSocketInstance.newChatMessage(
        message
      );
    });
  }


  const isOnlineCallback = (data) => {
    let onlineUserDict = localStorage.getItem('onlineUserDict') ? JSON.parse(localStorage.getItem('onlineUserDict')) : {};
    onlineUserDict[data.userId] = data.status;
    localStorage.setItem('onlineUserDict', JSON.stringify(onlineUserDict));
    let allUsers = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    console.log(data);
    // console.log(allUsers); && item.title.search("🟢") === -1
    console.log(onlineUserDict);
    console.log(allUsers);
    allUsers.find((item, i) => {
      item.title = ((item.id == data.userId && data.status) || onlineUserDict[item.id]) ? `${item.title.replaceAll("🟢", "")} 🟢` : `${item.title.replaceAll("🟢", "")}`;
    });
    // console.log(allUsers);
    localStorage.setItem('users', JSON.stringify(allUsers));
    console.log('online users updated');
    console.log(localStorage.getItem('users'));
    setDummy(new Date())
  }

  const setMessagesCallback = (data) => {
    let allUsers = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    let chatMessagesDict = localStorage.getItem('chatMessagesDict') ? JSON.parse(localStorage.getItem('chatMessagesDict')) : [];
    // console.log(data);
    let currUserObj = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};
    // console.log('CURRENT USER:', currUserObj.id, 'SENDER:',data.senderId, 'RECIEVER:',data.recieverId);
    // TODO chat id may already exist, add fix for that (Done)
    // TODO Show fetched messages (done)
    // TODO Disconnect old websockets
    let index;
    chatMessagesDict.find((item, i) => { if (item[data.chat_id]) index = i })
    console.log(index);
    if (index != undefined) {
      console.log('here');
      chatMessagesDict[index][data.chat_id] = data.fetched_messages
      localStorage.setItem('chatMessagesDict', JSON.stringify(chatMessagesDict));
    } else {
      let t = {}
      t[data.chat_id] = data.fetched_messages
      chatMessagesDict.push(t)
      // console.log(JSON.stringify(chatMessagesDict));
      localStorage.setItem('chatMessagesDict', JSON.stringify(chatMessagesDict));
    }
    if (data.recieverId === currUserObj.id || data.senderId === currUserObj.id) {
      redirectPage("/chat/" + data.chat_id);
      let senderId = data.senderId;
      let recieverId = data.recieverId;
      let chatUserDict = [];
      allUsers.find((item, i) => {
        if (item.id == senderId || item.id == recieverId) {
          chatUserDict.push({ 'userId': item.id, 'chatId': data.chat_id });
          item.chatId = data.chat_id;
        }
      });
      localStorage.setItem('users', JSON.stringify(allUsers));
      localStorage.setItem('chatUserDict', JSON.stringify(chatUserDict));
      localStorage.setItem('currentChatId', data.chat_id)
      setDummy(new Date())
    } else {
      //pass
    }
  }


  const addMessageCallback = (data, chatMessages, getUsers) => {
    // userList.map((item) => { if (item.chatId == data.chat_id) item.unread += 1 })
    // TODO Check if chat id does not exits (done)
    // TODO Add unread
    // let messageList = chatMessages();
    console.log(data);
    console.log(chatMessages);
    let chatMessagesDict = localStorage.getItem('chatMessagesDict') ? JSON.parse(localStorage.getItem('chatMessagesDict')) : [];
    let index;
    chatMessagesDict.find((item, i) => { if (item[data.chat_id]) index = i })
    console.log(index);
    if (index != undefined) {
      console.log('here');
      chatMessagesDict[index][data.chat_id].unshift(data)
      localStorage.setItem('chatMessagesDict', JSON.stringify(chatMessagesDict));
    } else {
      let t = {}
      t[data.chat_id] = data.fetched_messages
      chatMessagesDict.push(t)
      console.log(JSON.stringify(chatMessagesDict));
      localStorage.setItem('chatMessagesDict', JSON.stringify(chatMessagesDict));
    }
    let div = document.getElementById('messageDiv')
    div.scrollTop = div.scrollHeight;
    setDummy(new Date())
    // let message = { ...chatMessagesDict }
    // console.log(messageList);
    // let temp = messageList[data.chat_id] ? messageList[data.chat_id] : [];;
    // console.log(temp);
    // temp.push(data);
    // messageList[data.chat_id] = temp
    // let o = { ...chatMessagesDict, [data.chat_id]: temp }
    // console.log(messageList);
    //! Why spread operator immediately updates the state variable
    // setChatMessagesDict({ ...messageList, [data.chat_id]: temp })
  }

  const waitForSocketConnection = (callback) => {
    console.log('waiting');
    // console.log(WebSocketInstance.state());
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

  const deleteAll = () => {
    const options = {
      method: "DELETE",
      url: "/delete_all_chats"
    }
    let data = [];
    axiosInstance.request(options).then((res) => {
      setDeletedMsg('DELETED ALL CHATS !');
      setTimeout(() => {
        setDeletedMsg('');
      }, 3000)
    }).catch((err) => {
      console.log(err);
    })
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

  const handleEnterBtn = (e) => {
    let code = e.keyCode || e.which;
    console.log(code)
    if (code === 13) {
      handleSubmit();
    }
  }

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


  const redirectPage = (page) => {
    navigate(page)
  }
  const handleLogout = () => {
    axiosInstance.get("logout/").then((response) => {
      if (response.data.ok) {
        initOnline(false);
        localStorage.removeItem("isAuth");
        localStorage.removeItem("user");
        localStorage.clear()
        redirectPage('/');
      } else {
        console.log("Error");
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  const handleSubmit = (e) => {

    setUserMessage("");
    // currChatId, message, senderId, recieverId
    const recieverId = parseInt(localStorage.getItem('reciever'))
    // const chatUserDict = JSON.parse(localStorage.getItem('chatUserDict'));
    const chatId = parseInt(window.location.href.split("/")[4])
    const userId = JSON.parse(localStorage.getItem('user')).id;
    console.log(window.location.href);
    console.log(chatId);
    console.log(userMessage);
    console.log(userId);
    console.log(recieverId);
    // userList.map((item) => { if (item.id == currentChatId.id) { chatId = item.chatId } })
    newMessageSocketInit(chatId, userMessage, currUser.id, currentChatId.id);
    console.log(`handlesubmit called`);
  };
  const handleReply = () => {
    console.log('natural');

  }

  const getUserMessages = (groupId) => {
    // console.log(`getUserMessages : ${groupId}`);
    const currentChatId = localStorage.getItem('currentChatId');
    const currentUserId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : 0;
    let chatMessagesDict = localStorage.getItem('chatMessagesDict') ? JSON.parse(localStorage.getItem('chatMessagesDict')) : [];
    let userMessages = chatMessagesDict.find(i => i[currentChatId])
    let t = {}
    let msg = []
    if (userMessages) {
      console.log(currentChatId);
      console.log(userMessages);
      console.log(typeof (userMessages[currentChatId]));
      userMessages[currentChatId].map((i) => { t = { position: i.author_id === currentUserId ? 'right' : 'left', type: 'text', text: i.content, date: new Date(i.timestamp), title: i.author, }; msg.push(t) })
      return msg.reverse();
    }
    else
      return []
  };


  return (
    <Container fluid style={{ height: '100vh' }} >
      <Row style={{ height: '100vh' }} >
        <Col lg="5" style={{ height: '100vh', }}  >
          <div style={{ height: '7vh' }} className='navBar'>
            <Image roundedCircle src='https://picsum.photos/200' style={{ 'width': '8%' }} />
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic" data-testid="dropdown">
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>New Group</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout} data-testid="logoutDropdown">Logout</Dropdown.Item>
                <Dropdown.Item href='/profile' >Settings</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <ChatList
            className="chat-list"
            onClick={handleConversationClick}
            dataSource={userList}
          />
          {/* <div className="online_status"></div> */}
        </Col>
        <Col lg="7" style={{ height: '100vh', background: 'aliceBlue' }} >
          <div style={{ height: '7vh' }}>
            {JSON.parse(localStorage.getItem('user')).username} <ReactButton style={{ margin: '10px' }} size="sm" variant="danger" onClick={() => deleteAll()}>DELETE ALL</ReactButton> {deletedMsg}
          </div>
          <div style={{ height: '82vh' }} className='message-list' id="messageDiv">
            <MessageList
              className="message-list"
              lockable
              toBottomHeight="100%"
              dataSource={getUserMessages(currentChatId)}
              onReplyClick={handleReply}

            />
          </div>

          <div className='input'>
            <Row style={{ margin: '0px', padding: '0px' }}>
              <Col xs={9} sm={9} md={9} lg={10} xl={10}>
                <input
                  className="form-control"
                  style={{ zIndex: '10' }}
                  placeholder="Type here..."
                  name="user_message"
                  value={userMessage}
                  onChange={handleOnChange}
                  onKeyPress={handleEnterBtn}
                />
              </Col>
              <Col xs={3} sm={3} md={3} lg={2} xl={2}>
                <Button
                  onClick={handleSubmit}
                  color='white'
                  backgroundColor='black'
                  text='Send' />
              </Col>
            </Row>


          </div>
        </Col>
      </Row>
    </Container >
  );
}

export default Chat;
