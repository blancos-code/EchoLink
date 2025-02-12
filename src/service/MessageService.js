import axios from 'axios';
import AuthService from "@/service/AuthService.js";

const apiClient = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

class MessageService {

  async getConversations(userId) {
    try {
      const token = AuthService.getToken();
      const response = await apiClient.get(`/users/${userId}/conversations`, {headers: {Authorization: `Bearer ${token}`},});
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }

  async getMessages(conversationId) {
    try {
      const token = AuthService.getToken();
      const response = await apiClient.get(`/conversations/${conversationId}/messages`, {headers: {Authorization: `Bearer ${token}`},});
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async createConversation({ name, participantId }) {
    try {
      const token = AuthService.getToken();
      const userId = JSON.parse(localStorage.getItem('userId'));
      const response = await apiClient.post(`/conversations`, {
        name,
        sender: userId,
        recipient: participantId
      }, {headers: {Authorization: `Bearer ${token}`},});

      return response.data;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  }

  async sendMessage({ conversationId, text }) {
    try {
      const token = AuthService.getToken();
      const userId = JSON.parse(localStorage.getItem('user')).userId;

      const response = await apiClient.post(`/conversations/${conversationId}`, {
        user: userId,
        text
      }, {headers: {Authorization: `Bearer ${token}`},});

      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

}

export default new MessageService();