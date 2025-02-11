import AuthService from "@/service/AuthService.js";
import axios from 'axios';
class ForumService {
    constructor() {
        this.socket = null;
        this.eventListeners = {};
        this.API_URL = 'http://localhost:4000/api/forums';
    }

    connect(userId) {
        this.socket = new WebSocket('ws://localhost:4000');
        this.socket.addEventListener('open', () => {
            console.log('WebSocket connected');
            this.socket.send(JSON.stringify({ type: 'connect', payload: { userId } }));
        });


        this.socket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            if (this.eventListeners[data.type]) {
                this.eventListeners[data.type](data.payload);
            }
        });


        this.socket.addEventListener('close', () => {
            console.log('WebSocket disconnected');

        });


        this.socket.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
        });



        this.socket.addEventListener('message', (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'connect' && data.status === 'success') {
                    console.log('Successfully connected and authenticated with WebSocket!');
                    this.joinForum(this.selectedForumId);
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

    async getAllForums() {
        try {
            const token = AuthService.getToken();
            const response = await axios.get(`${this.API_URL}/forum`, {headers: {Authorization: `Bearer ${token}`},}); // Updated URL
            return response.data;
        } catch (error) {
            console.error('Error fetching forums:', error);
            return [];
        }
    }

    async getForumById(forumId) {
        try {
            const token = AuthService.getToken();
            const response = await axios.get(`${this.API_URL}/forum/${forumId}`, {headers: {Authorization: `Bearer ${token}`},}); // Updated URL
            return response.data;
        } catch (error) {
            console.error('Error getting forum by id', error);
            return {};
        }
    }


    async getForumMessages(forumId) {
        try {
            const token = AuthService.getToken();
            const response = await axios.get(`${this.API_URL}/forum/${forumId}/messages`, {headers: {Authorization: `Bearer ${token}`},}); // Corrected URL
            return response.data;
        } catch (error) {
            console.error('Error fetching forum messages:', error);
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


    async postMessage(forumId, message) {

        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            console.error("WebSocket not connected. Cannot send message.");
            return;
        }

        try {
            this.socket.send(JSON.stringify({
                type: 'newMessage',
                payload: { forumId, text: message }
            }));
        } catch (error) {
            console.error("Error sending message over WebSocket:", error);
        }

    }
}

export default new ForumService();