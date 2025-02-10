import axios from 'axios';

class MessageService {
  constructor() {
    this.socket = null;
    this.eventListeners = {};
    this.API_URL = 'http://localhost:4000/api';
  }

  connect(userId) {
    this.socket = new WebSocket('ws://localhost:4000');
    
    this.socket.onopen = () => {
      console.log("WebSocket connected");
      this.socket.send(JSON.stringify({ type: 'connect', userId }));
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (this.eventListeners[data.type]) {
        this.eventListeners[data.type](data);
      }
    };

    this.socket.onclose = () => {
      console.log("WebSocket disconnected");
      // Implement reconnection logic here if needed
    };
  }

  on(eventType, callback) {
    this.eventListeners[eventType] = callback;
  }

  async getConversations(userId) {
    try {
      const response = await axios.get(`${this.API_URL}/users/${userId}/conversations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }

  async getMessages(conversationId) {
    try {
      const response = await axios.get(`${this.API_URL}/conversations/${conversationId}/messages`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async createChat({ name, participantId }) {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post(`${this.API_URL}/conversations/create`, {
        name,
        sender: user.id,
        recipient: participantId
      });

      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({
          type: 'new_conversation',
          sender: user.id,
          recipient: participantId,
          conversation: response.data
        }));
      }

      return response.data;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  }

  sendMessage(sender, recipient, text) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'private_message',
        sender,
        recipient,
        text
      }));
    }
  }
}

export default new MessageService();