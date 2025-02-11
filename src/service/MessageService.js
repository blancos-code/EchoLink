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

  async createConversation({ name, participantId }) {
    try {
      const userId = JSON.parse(localStorage.getItem('userId'));
      const response = await axios.post(`${this.API_URL}/conversations`, {
        name,
        sender: userId,
        recipient: participantId
      });

      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({
          type: 'new_conversation',
          sender: userId,
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

  async sendMessage({ conversationId, text }) {
    try {
      const userId = JSON.parse(localStorage.getItem('userId'));
      const response = await axios.post(`${this.API_URL}/conversations/${conversationId}`, {
        sender: userId,
        text
      });

      // if (this.socket?.readyState === WebSocket.OPEN) {
      //   this.socket.send(JSON.stringify({
      //     type: 'private_message',
      //     sender,
      //     recipient,
      //     text
      //   }));
      // }

      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

}

export default new MessageService();