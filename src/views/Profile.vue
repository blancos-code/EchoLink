<template>
  <v-container>
    <v-card>
      <v-card-title>Mon Profile</v-card-title>
      <v-card-text>
        <v-form ref="formRef" lazy-validation>
          <v-avatar size="150" class="mb-4">
            <v-img v-if="user.image" :src="API_URL + user.image" alt="Avatar"></v-img>
          </v-avatar>

          <v-file-input
              v-model="selectedImage"
              accept="image/*"
              label="Changer d'image"
          ></v-file-input>

          <v-text-field v-model="user.nom" label="Nom" :rules="[rules.required]"></v-text-field>
          <v-text-field v-model="user.prenom" label="Prenom" :rules="[rules.required]"></v-text-field>
          <v-text-field v-model="user.email" label="Email" :rules="[rules.required, rules.email]"></v-text-field>
          <v-text-field v-model="user.tel" label="Numéro de téléphone" :rules="[rules.required]"></v-text-field>
        </v-form>

        <v-btn color="primary" class="mt-4" @click="saveProfile" :disabled="loading" :loading="loading">
          Save
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import UserService from '@/service/userService.js';
import AuthService from '@/service/AuthService.js';
const API_URL = "http://localhost:4000";
const user = ref({});
const selectedImage = ref(null);
const formRef = ref(null);
const loading = ref(false);

const rules = reactive({
  required: value => !!value || 'Required.',
  email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email.',
});

onMounted(async () => {
  try {
    const userId = AuthService.getCurrentUserId();
    const userData = await UserService.getUserById(userId);
    user.value = userData;
  } catch (error) {
    console.error("Error loading user data:", error);
  }
});

const saveProfile = async () => {
  if (!formRef.value || !(await formRef.value.validate())) return;

  try {
    loading.value = true;

    const formData = new FormData();
    formData.append("nom", user.value.nom);
    formData.append("prenom", user.value.prenom);
    formData.append("email", user.value.email);
    formData.append("tel", user.value.tel);

    if (selectedImage.value) {
      formData.append("image", selectedImage.value);
    }

    const updatedUser = await UserService.updateUser(user.value._id, formData);
    user.value = updatedUser;
  } catch (error) {
    console.error("Error saving profile:", error);
  } finally {
    loading.value = false;
  }
};
</script>
