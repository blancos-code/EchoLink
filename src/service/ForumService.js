import AuthService from "@/service/AuthService.js";
import axios from 'axios';

class ForumService {
    constructor() {
        this.socket = null;
        this.eventListeners = {};
        this.API_URL = 'http://localhost:4000/api/forums';
        this.selectedForumId = null;
    }

    async getAllForums() {
        try {
            const token = AuthService.getToken();
            const response = await axios.get(`${this.API_URL}/forum`, {headers: {Authorization: `Bearer ${token}`},});
            return response.data;
        } catch (error) {
            console.error('Error fetching forums:', error);
            return [];
        }
    }

    async createForum(forumData) {
        try {
            const token = AuthService.getToken();
            const response = await axios.post(`${this.API_URL}/forum`, forumData, {headers: {Authorization: `Bearer ${token}`},});
            return response.data;
        } catch (error) {
            console.error("Error creating forum:", error);
            throw error;
        }
    }

    async getForumMessages(forumId) {
        try {
            const token = AuthService.getToken();
            const response = await axios.get(`${this.API_URL}/forum/${forumId}/message`, {headers: {Authorization: `Bearer ${token}`},});
            return response.data;
        } catch (error) {
            console.error('Error fetching forum messages:', error);
            return [];
        }
    }

    async sendMessage(forumId, message) {
        try {
            const token = AuthService.getToken();
            const userId = AuthService.getCurrentUserId();
            const response = await axios.post(`${this.API_URL}/forum/${forumId}/message`, { user: userId, text: message},{headers: {Authorization: `Bearer ${token}`},});
            return response.data;
        } catch (error) {
            console.error('Error sending message:', error);
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
            this.eventListeners[event].forEach(listener => listener(data));
        }
    }

}




export default new ForumService();