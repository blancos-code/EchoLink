import axios from 'axios';

const API_URL = 'http://localhost:4000/api/auth';

class AuthService {
    async login(user) {
        try {
            const response = await axios.post(`${API_URL}/login`, user);
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data)); // Store user data in local storage
            }
            return response.data;
        } catch (error) {
            console.error("Login error:", error);
            if (error.response && error.response.data && error.response.data.errors) {
                throw error.response.data.errors; // Re-throw the error messages from the API
            } else {
                throw new Error("An error occurred during login."); // Generic error message
            }
        }
    }

    async register(user) {
        try {
            const response = await axios.post(`${API_URL}/register`, user);
            if (response.data.token) {  // Check if registration returns a token (adjust if needed)
                localStorage.setItem('user', JSON.stringify(response.data));
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
        localStorage.removeItem('user');
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    isAuthenticated() { // Helper method to check if user is authenticated
        return !!localStorage.getItem('user'); // Returns true if user is logged in, false otherwise.
    }
}

export default new AuthService(); // Export an instance of the service