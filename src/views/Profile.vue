<template>
  <v-container>
    <v-card>
      <v-card-title>Mon Profile</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-avatar size="150" class="mb-4">
            <v-img :src="user.image" alt="Avatar"></v-img>
          </v-avatar>
          <v-file-input
              v-model="selectedImage"
              accept="image/*"
              label="Changer d'image"
          ></v-file-input>

          <v-text-field
              v-model="user.nom"
              label="Nom"
              :rules="[rules.required]"
          ></v-text-field>

          <v-text-field
              v-model="user.prenom"
              label="Prenom"
              :rules="[rules.required]"
          ></v-text-field>


          <v-text-field
              v-model="user.email"
              label="Email"
              :rules="[rules.required, rules.email]"
          ></v-text-field>


          <v-text-field
              v-model="user.tel"
              label="Numéro de téléphone"
              :rules="[rules.required]"
          ></v-text-field>
        </v-form>

        <v-btn
            color="primary"
            class="mt-4"
            @click="saveProfile"
            :disabled="!valid || loading"
            :loading="loading"
        >
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
const user = ref({});
const selectedImage = ref(null);
const loading = ref(false); // Loading state for button
const valid = ref(false);

const rules = reactive({
  required: value => !!value || 'Required.',
  email: value => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Invalid e-mail.'
  },
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
  if (!valid.value) return;

  try {
    loading.value = true;

    const updatedData = new FormData();

    const updatedFields = {};
    updatedFields.nom = user.value.nom;
    updatedFields.prenom = user.value.prenom;
    updatedFields.email = user.value.email;
    updatedFields.tel = user.value.tel;

    if (selectedImage.value) {
      updatedData.append('image', selectedImage.value);
    }

    const dataToSend = selectedImage.value ? updatedData : updatedFields;
    const updatedUser = await UserService.updateUser(user.value._id, dataToSend);
    user.value = updatedUser;
  } catch (error) {
    console.error("Error saving profile:", error);
  } finally {
    loading.value = false;
  }
};

</script>