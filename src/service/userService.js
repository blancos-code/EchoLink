import apiService from "./ApiService";

class UserService {
  async getAllUsers() {
    try {
      const response = await apiService.get("/users");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const response = await apiService.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      throw error;
    }
  }

  async getReviewsByUserId(userId) {
    try {
      const response = await apiService.get(`/users/${userId}/reviews`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des commenntaire de l'utilisateur :", error);
      throw error;
    }
  }


  async updateUser(userId, userData) {
    try {
      const response = await apiService.put(`/users/${userId}`, userData);
      console.log("Données mises à jour :", response.data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
      throw error;
    }
  }

  async submitUserReview(userId, reviewData) {
    try {
      const response = await apiService.post(`/users/${userId}/reviews`, reviewData);
      console.log("Commentaire envoyé:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'envoie du commentaire de l'utilisateur :", error);
      throw error;
    }
  }
}

export default new UserService();
