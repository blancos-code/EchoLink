import axios from 'axios';
import AuthService from "@/service/AuthService.js";

class ThematiqueService {
    constructor() {
        this.API_URL = 'http://localhost:4000/api/thematiques';
    }

    async getAllThematiques() {
        try {
            const token = AuthService.getToken();
            const response = await axios.get(`${this.API_URL}/thematique`, {headers: {Authorization: `Bearer ${token}`},},);

            return response.data;
        } catch (error) {
            console.error("Error getting thematiques:", error);
            return [];
        }
    }

    createThematique(thematiqueData) {
        const token = AuthService.getToken();
        console.log(token);
        return axios.post(`${this.API_URL}/thematique`, thematiqueData, {headers: {Authorization: `Bearer ${token}`},});
    }

    deleteThematique(thematiqueId) {
        const token = AuthService.getToken();
        return axios.delete(`${this.API_URL}/thematique/${thematiqueId}`, {headers: {Authorization: `Bearer ${token}`},});
    }


}

export default new ThematiqueService();