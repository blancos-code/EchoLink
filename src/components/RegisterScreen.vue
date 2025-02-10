<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex class="w-50 mx-auto">
        <v-card>
          <v-toolbar color="primary" :dark="true">
            <v-toolbar-title>Créer un compte</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field prepend-icon="person" type="text" v-model="user.nom" label="Nom"></v-text-field>
              <v-text-field prepend-icon="person" type="text" v-model="user.prenom" label="Prénom"></v-text-field>
              <v-text-field prepend-icon="person" type="text" v-model="user.email" label="E-mail"></v-text-field>
              <v-text-field prepend-icon="person" type="text" v-model="user.tel" label="Téléphone"></v-text-field>
              <v-text-field
                  prepend-icon="lock"
                  type="password"
                  v-model="user.password"
                  label="Mot de passe"
              ></v-text-field>
            </v-form>
            <router-link to="/login" class="text-center">Vous avez déjà un compte ? Se connecter</router-link>
            <v-alert type="error" v-if="errorRegister">
              Erreur création de compte
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="primary" @click="register">Créer un compte</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import AuthService from "../service/AuthService.js";

export default {
  name: "Register",
  data() {
    return {
      errorRegister: false,
      user: {
        email: '',
        password: '',
        nom:'',
        prenom:'',
        tel: ''
      }
    };
  },
  methods: {
    async register() {  // Make the login method async
      this.errorRegister = false;
      try {
        const response = await AuthService.register(this.user);
        console.log('Register successful:', response.data);  // Log the response data
        this.$router.push('/');
      } catch (error) {
        console.error('Login failed:', error);
        this.errorRegister = true;
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