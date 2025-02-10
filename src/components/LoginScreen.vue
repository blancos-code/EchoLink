<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex class="w-50 mx-auto">
        <v-card>
          <v-toolbar color="primary" :dark="true">
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field prepend-icon="person" type="text" v-model="user.email" label="E-mail"></v-text-field>
              <v-text-field
                  prepend-icon="lock"
                  type="password"
                  v-model="user.password"
                  label="Mot de passe"
              ></v-text-field>
            </v-form>
            <router-link to="/register" class="text-center">Pas encore de compte ? Créer un compte</router-link>
            <v-alert type="error" v-if="errorLogin">
              Utilisateur ou mot de passe invalide
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="primary" @click="login">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import AuthService from "../service/AuthService.js";

export default {
  name: "Login",
  data() {
    return {
      errorLogin: false,
      user: {
        email: '',
        password: ''
      }
    };
  },
  methods: {
    async login() {  // Make the login method async
      this.errorLogin = false;
      try {
        const response = await AuthService.login(this.user);
        console.log('Login successful:', response.data);
        // Redirect to the home page or another protected route
        this.$router.push('/');

      } catch (error) {
        console.error('Login failed:', error);
        this.errorLogin = true;
        // Display a more specific error message to the user if available
        if (error.response && error.response.data && error.response.data.message) {
          this.errorMessage = error.response.data.message; // Use a dedicated error message variable
        } else {
          this.errorMessage = "An error occurred during login."; // Generic error message
        }

      }
    }
  }
};
</script>

<style>

</style>