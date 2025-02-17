import axios from "axios";
import AuthService from "./AuthService";
import {router} from "../router/router.js";

const API_URL = "http://localhost:4000/api";

const apiService = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

apiService.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Token invalide ou expiré, déconnexion...");
      AuthService.logout();
      router.push("/auth");
    }
    return Promise.reject(error);
  }
);

export default apiService;
