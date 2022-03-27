import { SOCKET_URL } from "../constants";

class WebSocketService {

  static instance = null;
  callbacks = {};

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  constructor() {
    this.socketRef = null;
  }

  connect(chatId) {
    // const webSocketPath = `${SOCKET_URL}/ws/chat/${userId}/`;
    const webSocketPath = chatId?`${SOCKET_URL}/ws/chat/${chatId}/`:`${SOCKET_URL}/ws/chat/`;
    this.socketRef = new WebSocket(webSocketPath);
    this.socketRef.onopen = () => {
      console.log("WebSocket open");
    };
    this.socketRef.onmessage = e => {
      this.socketNewMessage(e.data);
    };
    this.socketRef.onerror = e => {
      console.log(e.message);
    };
    this.socketRef.onclose = () => {
      console.log("WebSocket closed let's reopen");
      this.connect();
    };
  }

  disconnect() {
    this.socketRef.close();
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    if (Object.keys(this.callbacks).length === 0) {
      return;
    }
    if (command === "messages") {
      this.callbacks[command](parsedData.messages);
    }
    if (command === "new_message") {
      this.callbacks[command](parsedData.message);
    }
    if (command === "is_online") {
      this.callbacks[command](parsedData.message);
    }
  }

  fetchMessages(chatId, message) {
    console.log('fetching messages');
    this.sendMessage({
      command: "fetch_messages",
      senderId: message.senderId,
      recieverId: message.recieverId,
      chatId: chatId ? chatId : 0
    });
  }

  newChatMessage(message) {
    console.log('new chat messages');
    this.sendMessage({
      command: "new_message",
      message: message.content,
      chatId: message.chatId,
      senderId: message.senderId,
      recieverId: message.recieverId
    });
  }

  isOnline(data){
    console.log('online user');
    this.sendMessage({
      command: "is_online",
      status: data.status,
      userId: data.userId
    });
  }

  chatCallbacks(messagesCallback, newMessageCallback, isOnlineCallback) {
    this.callbacks["messages"] = messagesCallback;
    this.callbacks["new_message"] = newMessageCallback;
    this.callbacks["is_online"] = isOnlineCallback;
  }

  sendMessage(data) {
    try {
      this.socketRef.send(JSON.stringify({ ...data }));
    } catch (err) {
      console.log(err.message);
    }
  }

  state() {
    return this.socketRef.readyState;
  }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;