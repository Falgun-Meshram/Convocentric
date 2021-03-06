import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { Col, Container, Row, Dropdown, Image } from 'react-bootstrap';
import { ChatList, MessageList, Button } from 'react-chat-elements';
import { useNavigate } from 'react-router-dom';
import WebSocketInstance from "./Socket";
import axiosInstance from './axiosInstance';
import '../css/App.css';
import '../css/Chat.css';
import 'react-chat-elements/dist/main.css';
import axios from 'axios';
import { defaultProfilePictureImageDataUri } from '../constants';

function Chat() {

  const navigate = useNavigate();
  const [currUser, setCurrUser] = useState({});
  const [userMessage, setUserMessage] = useState("");
  const [deletedMsg, setDeletedMsg] = useState("");
  const [currentChatId, setChatId] = useState({
    id: "",
  });
  const [currentChat, setCurrentChat] = useState({});
  const [dummy, setDummy] = useState("");
  const [currentSelectedChatUser, setCurrentSelectedChatUser] = useState("");
  const userList = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
  const [userNameDict, setUserNameDict] = useState({});
  
  const getUsers = () => { return userList }

  useEffect(() => {
    localStorage.setItem('currentChatId', "");
    initWebsocket();
    let user = {};
    if (localStorage.getItem('user')) {
      user = JSON.parse(localStorage.getItem('user'));
    }
    setCurrUser(user);
    getAllUsers();
  }, []);

  useEffect(() => {
    let div = document.getElementById('messageDiv')
    div.scrollTop = div.scrollHeight;
  }, [dummy]);

  const getAllUsers = async () => {
    
    const options = {
      method: 'GET',
      url: process.env.REACT_APP_BASE_URL+'get_all_users/',
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
        "Content-Type": "application/json",
        accept: "application/json",
      }
    };
    let onlineUserDict = localStorage.getItem('onlineUserDict') ? JSON.parse(localStorage.getItem('onlineUserDict')) : {};
    try {
      const res = await axios.request(options);
      let data = [];
      let currentChatIds = [];
      let chatUserDict = [];
      let userNameDict = {};
      res.data.users.map((item) => {
        userNameDict[item.username] = item.id;
        if (item.chatId) {
          currentChatIds.push(item.chatId);
          chatUserDict.push({ 'userId': item.id, 'chatId': item.chatId ? item.chatId : 0 });
        }
        data.push({
          title: onlineUserDict[item.id] ? `${item.username} ????` : `${item.username.replaceAll("????", "")}`,
          id: String(item.id),
          avatar: item.profile_picture?item.profile_picture:defaultProfilePictureImageDataUri,
          // subtitle: item.last_message?item.last_message:'No messages yet !',
          alt: 'Profile Picture',
          date: new Date(),
          unread: 0,
          chatId: item['chatId'] ? item['chatId'] : 0
        })

      })
      setUserNameDict(userNameDict);
      localStorage.setItem('users', JSON.stringify(data));
      localStorage.setItem('chatUserDict', JSON.stringify(chatUserDict));
      let currentPath = window.location.href.split('/');
      let currentChatId = currentPath.length > 4 ? currentPath[4] : null;
      setDummy(new Date())
      if (currentChatIds.includes(currentChatId)) {
        redirectPage("/chat/" + data.chat_id);
      } else {
        redirectPage("/chat");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const initOnline = (status) => {
  
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

  const setChatBackgroundMethod = (chat) => {
    // Selected Chat background 
    let allChatElements = [...document.getElementsByClassName('rce-container-clist chat-list')[0].childNodes];
    let chatTitle = chat.title;
    allChatElements.map(item => {
      let currEle = item.childNodes[0];
      if(item.innerText.replaceAll(" ", "") == chatTitle.replaceAll(" ", "")){
        currEle.style.setProperty('background-color', '#E8E8E8', 'important');
      }else{
        currEle.style.setProperty('background-color', 'white', 'important');
      }
    })
  }

  const handleConversationClick = (chat) => {
    
    setChatBackgroundMethod(chat);
    let recieverId = parseInt(chat.id);
    let currentClickedChatId = parseInt(chat.chatId);
    let currUserObj = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : [];
    setCurrentSelectedChatUser(chat.title);
    setCurrentChat(chat);
    let currChatUserDict = localStorage.getItem('chatUserDict') ? JSON.parse(localStorage.getItem('chatUserDict')) : [];
    let existingChatId = 0;
    localStorage.setItem("reciever", recieverId.toString())
    currChatUserDict.map(item => {
      if (item.chatId == currentClickedChatId) {
        existingChatId = item.chatId;
      }
    })
    let messages = { senderId: currUserObj.id, recieverId: recieverId };
    initializeChat(currentClickedChatId, messages);
  };

  const newMessageSocketInit = (chatId, msg, senderId, recieverId) => {

    // message needs to have senderId and recieverId
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
    allUsers.find((item, i) => {
      item.title = ((item.id == data.userId && data.status) || onlineUserDict[item.id]) ? `${item.title.replaceAll("????", "")} ????` : `${item.title.replaceAll("????", "")}`;
    });
    localStorage.setItem('users', JSON.stringify(allUsers));
    setDummy(new Date())
  }

  const setMessagesCallback = (data) => {
    let allUsers = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    let chatMessagesDict = localStorage.getItem('chatMessagesDict') ? JSON.parse(localStorage.getItem('chatMessagesDict')) : [];
    let currUserObj = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};
    let index;
    chatMessagesDict.find((item, i) => { if (item[data.chat_id]) index = i })
    if (index != undefined) {
      chatMessagesDict[index][data.chat_id] = data.fetched_messages
      localStorage.setItem('chatMessagesDict', JSON.stringify(chatMessagesDict));
    } else {
      let t = {}
      t[data.chat_id] = data.fetched_messages
      chatMessagesDict.push(t)
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
    
    let chatMessagesDict = localStorage.getItem('chatMessagesDict') ? JSON.parse(localStorage.getItem('chatMessagesDict')) : [];
    let allUsers = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    let senderId = data['senderId'];
    let recieverId = data['recieverId'];
    allUsers.find((item, i) => {
      if (item.id == senderId || item.id == recieverId) {
        item.last_message = data.content;
      }
    });
    localStorage.setItem('users', JSON.stringify(allUsers));
    let index;
    chatMessagesDict.find((item, i) => { if (item[data.chat_id]) index = i })
    if (index != undefined) {
      chatMessagesDict[index][data.chat_id].unshift(data)
      localStorage.setItem('chatMessagesDict', JSON.stringify(chatMessagesDict));
    } else {
      let t = {}
      t[data.chat_id] = data.fetched_messages
      chatMessagesDict.push(t)
      localStorage.setItem('chatMessagesDict', JSON.stringify(chatMessagesDict));
    }
    let div = document.getElementById('messageDiv')
    div.scrollTop = div.scrollHeight;
    setDummy(new Date());
  }

  const waitForSocketConnection = (callback) => {
    setTimeout(function () {
      if (WebSocketInstance.state() === 1) {
        callback();
        return;
      } else {
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

  const handleOnChange = (e) => {
    setUserMessage(e.target.value);
  };

  const handleEnterBtn = (e) => {
    let code = e.keyCode || e.which;
    if (code === 13) {
      handleSubmit();
    }
  }

  const redirectPage = (page) => {
    navigate(page)
  }
  
  const handleLogout = () => {
    const options = {
      method: 'GET',
      url: process.env.REACT_APP_BASE_URL+'logout/',
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
        "Content-Type": "application/json",
        accept: "application/json",
      }
    };
    axios.request(options).then((response) => {
      if (response.data.ok) {
        initOnline(false);
        localStorage.clear();
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
    const chatId = parseInt(window.location.href.split("/")[4]);
    if(chatId){
      let recieverTitle = currentChat.title.replaceAll("????", "").trim();
      let recieverId =  userNameDict[recieverTitle];
      let senderId = currUser.id;
      newMessageSocketInit(chatId, userMessage, senderId, recieverId);
    }
  };

  const handleReply = () => {
    // pass
  }

  const getUserMessages = () => {
    const currentChatId = localStorage.getItem('currentChatId');
    if(currentChatId){
      const currentUserId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : 0;
      let chatMessagesDict = localStorage.getItem('chatMessagesDict') ? JSON.parse(localStorage.getItem('chatMessagesDict')) : [];
      let userMessages = chatMessagesDict.find(i => i[currentChatId])
      let t = {}
      let msg = []
      if (userMessages) {
        userMessages[currentChatId].map((i) => { t = { position: i.author_id === currentUserId ? 'right' : 'left', type: 'text', text: i.content, date: new Date(i.timestamp), title: i.author, }; msg.push(t) })
        return msg.reverse();
      }
      else{
        return []
      }
    }else{
      return []
    }
  };


  return (
    <Container fluid style={{ height: '100vh' }} >
      <Row style={{ height: '100vh' }} >
        <Col lg="5" style={{ height: '100vh', padding: '5px 10px 0px 10px', margin: '0px' }}>
          <div style={{ height: '7vh', borderBottom: '1px solid rgb(232,232,232)' }} className='navBar'>
            <Image roundedCircle src={currUser.profile_picture?currUser.profile_picture:defaultProfilePictureImageDataUri} style={{ 'width': '8%' }}/> <span style={{ color:'#2A4CBF', textTransform: 'capitalize', fontSize: '18px', marginLeft: '20px', fontWeight: 'bold' }}>{currUser && currUser.username?currUser.username:""}</span>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic" data-testid="dropdown">
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {/* <Dropdown.Item>New Group</Dropdown.Item> */}
                <Dropdown.Item onClick={handleLogout} data-testid="logoutDropdown">Logout</Dropdown.Item>
                <Dropdown.Item href='/profile'>Settings</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <ChatList
            className="chat-list"
            onClick={handleConversationClick}
            dataSource={localStorage.getItem('users')?JSON.parse(localStorage.getItem('users')):[]}
          />
        </Col>
        <Col lg="7" style={{ height: '100vh', background: 'aliceBlue' }} >
           <div style={{ height: '7vh' }}>
            <p style={{ padding: '10px 0px 0px 0px', fontSize: '20px', fontWeight: 'bold' }}>{currentSelectedChatUser?currentSelectedChatUser:""}</p>
          </div> 
          <div style={{ height: '82vh' }} className='message-list' id="messageDiv">
            <MessageList
              className="message-list"
              lockable
              toBottomHeight="100%"
              dataSource={getUserMessages()}
              onReplyClick={handleReply}

            />
          </div>

          <div className='input'>
            <Row style={{ margin: '0px', padding: '0px' }}>
              <Col xs={9} sm={9} md={9} lg={10} xl={11}>
                <input
                  disabled={!localStorage.getItem('currentChatId')}
                  className="form-control"
                  style={{ zIndex: '10' }}
                  placeholder="Type here..."
                  name="user_message"
                  value={userMessage}
                  onChange={handleOnChange}
                  onKeyPress={handleEnterBtn}
                />
              </Col>
              <Col xs={3} sm={3} md={3} lg={1} xl={1}>
                <Button
                  onClick={handleSubmit}
                  color='white'
                  backgroundColor='#198753'
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
