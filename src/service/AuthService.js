import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:4000/api/auth";

class AuthService {
  async login(user) {
    try {
      const response = await axios.post(`${API_URL}/login`, user);
      if (response.data.token) {
        console.log("TOKEN", response.data.token);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));

        const userData = this.getUserData(response.data.token);
        localStorage.setItem("userId", JSON.stringify(userData.id));
      }
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        throw error.response.data.errors;
      } else {
        throw new Error("An error occurred during login.");
      }
    }
  }

  getToken(){
    return localStorage.getItem("token");
  }

  async register(user) {
    try {
      const response = await axios.post(`${API_URL}/register`, user);
      if (response.data.token) {
        // Check if registration returns a token (adjust if needed)
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("token", response.data.token);

        const userData = this.getUserData(response.data.token);
        localStorage.setItem("userId", JSON.stringify(userData.id));
      }
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        throw error.response.data.errors; // Re-throw the detailed error messages for handling in the component
      } else {
        throw new Error("An error occurred during registration."); // Generic error for unexpected issues
      }
    }
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  getUserData(token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.user;
    } catch (error) {
      console.error("Erreur de décodage :", error);
      return null;
    }
  }

  isAuthenticated() {
    return !!localStorage.getItem("user");
  }
}

export default new AuthService();
