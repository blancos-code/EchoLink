import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:4000/api/auth";
const TOKEN_KEY = "token";
const USER_KEY = "user";
const USER_ID_KEY = "userId";

class AuthService {
  async login(user) {
    return this.authenticate(`${API_URL}/login`, user);
  }

  async register(user) {
    return this.authenticate(`${API_URL}/register`, user);
  }

  async authenticate(url, user) {
    try {
      const response = await axios.post(url, user);
      if (response.data.token) {
        this.storeUserData(response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error("Auth error:", error);
      throw error.response?.data?.errors || new Error("An error occurred during authentication.");
    }
  }

  storeUserData(token) {
    localStorage.setItem(TOKEN_KEY, token);
    const userData = this.getUserData(token);
    localStorage.setItem(USER_ID_KEY, JSON.stringify(userData?.id || null));
  }

  logout() {
    [TOKEN_KEY, USER_KEY, USER_ID_KEY].forEach((key) => localStorage.removeItem(key));
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  getCurrentUserId() {
    return JSON.parse(localStorage.getItem(USER_ID_KEY));
  }

  getUserData(token) {
    try {
      return jwtDecode(token)?.user || null;
    } catch (error) {
      console.error("Erreur de décodage :", error);
      return null;
    }
  }

  async verifyToken() {
    try {
      const token = this.getToken()

      const response = await axios.get(`${API_URL}/verifyToken`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data === true;
    } catch (error) {
      return false;
    }
  }

  async isAuthenticated() {
    if (!this.getToken()) return false;
    return await this.verifyToken();
  }
}

export default new AuthService();
