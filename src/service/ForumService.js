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


    connect(token) {
        this.socket = new WebSocket('ws://localhost:4000');

        this.socket.addEventListener('open', () => {
            console.log('WebSocket connected');
            this.socket.send(JSON.stringify({ type: 'connect', payload: { token:  token } }));
        });

        this.socket.addEventListener('message', (event) => {
            try {
                console.log("event data",event.data);
                const message = JSON.parse(event.data);
                console.log(message);


                if (message.type === 'newMessage' && message.payload.forumId === this.selectedForumId) {
                    this.emit('newMessage', message.payload);
                }

            } catch (error) {
                console.error("Failed to parse message or invalid message format:", error);
            }
        });

    }


    joinForum(forumId) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type: 'joinForum', payload: forumId }));
            this.selectedForumId = forumId;
        } else {
            console.error("WebSocket not connected. Cannot join forum.");
        }
    }

    leaveForum() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN && this.selectedForumId) {
            this.socket.send(JSON.stringify({ type: 'leaveForum', payload: this.selectedForumId }));
            this.selectedForumId = null;
        }
    }

    postMessage(forumId, message) {
        console.log("post message");

        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            console.error("WebSocket not connected. Cannot send message.");
            return;
        }

        try {
            this.socket.send(JSON.stringify({
                type: 'newMessage',
                payload: { forumId, text: message }
            }));
            console.log("message sent");
        } catch (error) {
            console.error("Error sending message over WebSocket:", error);
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