import apiService from "./ApiService";

class ThematiqueService {
    constructor() {
        this.API_URL = "/thematiques";
    }

    async getAllThematiques() {
        try {
            const response = await apiService.get(this.API_URL);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des thématiques :", error);
            return [];
        }
    }

    async getThematiqueByID(thematiqueId) {
        try {
            const response = await apiService.get(`${this.API_URL}/${thematiqueId}`);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération de la thématique :", error);
            return [];
        }
    }

    async createThematique(thematiqueData) {
        try {
            const response = await apiService.post(this.API_URL, thematiqueData);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la création de la thématique :", error);
            throw error;
        }
    }

    async deleteThematique(thematiqueId) {
        try {
            const response = await apiService.delete(`${this.API_URL}/${thematiqueId}`);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la suppression de la thématique :", error);
            throw error;
        }
    }
}

export default new ThematiqueService();
