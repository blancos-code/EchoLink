/*
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:4000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

class MessageService {

  async getConversations(userId) {
    try {
      const response = await apiClient.get(`/users/${userId}/conversations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }

  async getMessages(conversationId) {
    try {
      const response = await apiClient.get(`/conversations/${conversationId}/messages`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async createConversation({ name, participantId }) {
    try {
      const userId = JSON.parse(localStorage.getItem('userId'));
      const response = await apiClient.post(`/conversations`, {
        name,
        sender: userId,
        recipient: participantId
      });

      return response.data;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  }

  async sendMessage({ conversationId, text }) {
    try {
      const userId = JSON.parse(localStorage.getItem('userId'));
      const response = await apiClient.post(`/conversations/${conversationId}`, {
        sender: userId,
        text
      });
      
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

}

export default new MessageService();*/


import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

class MessageService {

  async getConversations(userId) {
    try {
      const response = await apiClient.get(`/users/${userId}/conversations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }

  async getMessages(conversationId) {
    try {
      const response = await apiClient.get(`/conversations/${conversationId}/messages`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async createConversation({ name, participantId }) {
    try {
      const userId = JSON.parse(localStorage.getItem('userId'));
      const response = await apiClient.post(`/conversations`, {
        name,
        sender: userId,
        recipient: participantId
      });

      return response.data;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  }

  async sendMessage({ conversationId, text }) {
    try {
      const userId = JSON.parse(localStorage.getItem('user')).userId;

      const response = await apiClient.post(`/conversations/${conversationId}`, {
        user: userId,
        text
      });

      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

}

export default new MessageService();