import apiService from "./ApiService";

class AlertService {
    constructor() {
        this.eventListeners = {};
    }

    async getAllAlerts() {
        try {
            const response = await apiService.get("/alerts");
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des alertes :", error);
            throw error;
        }
    }

    async createAlert(forumData) {
        try {
            const response = await apiService.post("/alerts", forumData);
            return response.data;
        } catch (error) {
            console.error("Error creating alert:", error);
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

export default new AlertService();
