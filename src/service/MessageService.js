import apiService from "./ApiService";
import AuthService from "./AuthService.js";

class MessageService {

  async getConversations(userId) {
    try {
      const response = await apiService.get(`/users/${userId}/conversations`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des conversations :", error);
      throw error;
    }
  }

  async getMessages(conversationId) {
    try {
      const response = await apiService.get(`/conversations/${conversationId}/messages`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des messages :", error);
      throw error;
    }
  }

  async createConversation({ name, participantId }) {
    try {
      const userId = AuthService.getCurrentUserId();
      const response = await apiService.post(`/conversations`, {
        name,
        sender: userId,
        recipient: participantId,
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de la conversation :", error);
      throw error;
    }
  }

  async sendMessage({ conversationId, text }) {
    try {
      const userId = AuthService.getCurrentUserId();
      const response = await apiService.post(`/conversations/${conversationId}`, {
        user: userId,
        text,
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du message :", error);
      throw error;
    }
  }
}

export default new MessageService();
