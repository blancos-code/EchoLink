import apiService from "./ApiService";
import AuthService from "./AuthService";

class ForumService {
  constructor() {
    this.socket = null;
    this.eventListeners = {};
    this.selectedForumId = null;
  }

  async getAllForums() {
    try {
      const response = await apiService.get("/forums");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des forums :", error);
      throw error;
    }
  }

  async createForum(forumData) {
    try {
      const response = await apiService.post("/forums", forumData);
      return response.data;
    } catch (error) {
      console.error("Error creating forum:", error);
      throw error;
    }
  }

  async getForumMessages(forumId) {
    try {
      const response = await apiService.get(`/forums/${forumId}/message`);
      return response.data;
    } catch (error) {
      console.error("Error fetching forum messages:", error);
      return [];
    }
  }

  async sendMessage(forumId, message) {
    try {
      const userId = AuthService.getCurrentUserId();
      const response = await apiService.post(`/forums/${forumId}/message`, { user: userId, text: message });
      return response.data;
    } catch (error) {
      console.error("Error creating forum:", error);
      throw error;
    }
  }

  on(event, listener) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(listener);
  }

  emit(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach((listener) => listener(data));
    }
  }
}

export default new ForumService();
