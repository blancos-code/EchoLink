import axios from "axios";

const API_URL = "http://localhost:4000/api/users";

class UserService {
  async getAllUsers() {
    try {
      const response = await axios.get(`${API_URL}/`);
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
}

export default new UserService();
