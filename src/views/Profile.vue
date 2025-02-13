<!--
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
              @change="changeImage"
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
const updatedImage = ref(null);
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

const changeImage = async (event) => {
  selectedImage.value = event.target.files[0];
  const arrayBuffer = await   selectedImage.value.arrayBuffer();
  updatedImage.value  = new Blob([arrayBuffer], {type:   selectedImage.value.type});
  console.log(updatedImage.value);
};


const saveProfile = async () => {
  if (!valid.value) return;

  try {
    loading.value = true;

    const updatedFields = {
      nom: user.value.nom,
      prenom: user.value.prenom,
      email: user.value.email,
      tel: user.value.tel,
    };
    if(updatedImage.value){
      //send binary of the image to the backend
      updatedFields.image = updatedImage.value;
    }

    const updatedUser = await UserService.updateUser(user.value._id, updatedFields);
    user.value = updatedUser;
  } catch (error) {
    console.error("Error saving profile:", error);
  } finally {
    loading.value = false;
  }
};

</script>-->


<template>
  <v-container>
    <v-card>
      <v-card-title>Mon Profile</v-card-title>
      <v-card-text>
        <v-form ref="formRef" lazy-validation>
          <v-avatar size="150" class="mb-4">
            <v-img v-if="user.image" :src="user.image" alt="Avatar"></v-img>
          </v-avatar>

          <v-file-input
              v-model="selectedImage"
              accept="image/*"
              label="Changer d'image"
              @change="changeImage"
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

const changeImage = () => {
  if (selectedImage.value) {
    console.log("Selected image:", selectedImage.value);
  }
};

const saveProfile = async () => {
  if (!formRef.value || !(await formRef.value.validate())) return;

  try {
    loading.value = true;

    // Use FormData to handle file upload
    const formData = new FormData();
    formData.append("nom", user.value.nom);
    formData.append("prenom", user.value.prenom);
    formData.append("email", user.value.email);
    formData.append("tel", user.value.tel);

    if (selectedImage.value) {
      formData.append("image", selectedImage.value);
    }

    console.log("Payload to send:", formData);

    const updatedUser = await UserService.updateUser(user.value._id, formData);
    user.value = updatedUser;
  } catch (error) {
    console.error("Error saving profile:", error);
  } finally {
    loading.value = false;
  }
};
</script>
