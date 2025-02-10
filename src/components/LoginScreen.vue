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
              {{ errorMessage }}
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

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user.js';
import AuthService from "../service/AuthService.js";

const router = useRouter();
const userStore = useUserStore();

const errorLogin = ref(false);
const errorMessage = ref("");
const user = ref({
  email: '',
  password: ''
});

const login = async () => {
  errorLogin.value = false;
  try {
    const response = await AuthService.login(user.value);
    console.log('Login successful:', response.data);

    const token = AuthService.getCurrentUser()['token'];
    const userData = AuthService.getUserData(token);
    userStore.setUser(userData);

    // Redirection après connexion
    router.push('/');

  } catch (error) {
    console.error('Login failed:', error);
    errorLogin.value = true;

    if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = "Une erreur est survenue lors de la connexion.";
    }
  }
};
</script>
