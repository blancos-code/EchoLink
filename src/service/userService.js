import axios from "axios";
import AuthService from "@/service/AuthService.js";

const API_URL = "http://localhost:4000/api/users";

class UserService {
  async getAllUsers() {
    try {
      const token = AuthService.getToken();
      const response = await axios.get(`${API_URL}/`, {headers: {Authorization: `Bearer ${token}`},});
      return response.data;
    } catch (error) {
      console.error("getAllUsers error:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        throw error.response.data.errors;
      } else {
        throw new Error("An error occurred during getting users.");
      }
    }
  }

  async getUserById(userId){
    try {
      const token = AuthService.getToken();
      const response = await axios.get(`${API_URL}/${userId}`, {headers: {Authorization: `Bearer ${token}`},});
      return response.data;
      } catch (error) {
      console.error("getUserById error:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        throw error.response.data.errors;
      } else {
        throw new Error("An error occurred during getting user.");
      }
    }
  }
}

export default new UserService();
