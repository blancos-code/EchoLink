<template>
  <v-container class="auth-container fill-height" fluid>
    <v-row class="fill-height" align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="8" class="auth-card rounded-lg">
          <v-tabs v-model="activeTab" color="primary" grow>
            <v-tab value="login">Login</v-tab>
            <v-tab value="register">Register</v-tab>
          </v-tabs>

          <v-card-text class="pt-6">
            <v-window v-model="activeTab">
              <!-- Login Form -->
              <v-window-item value="login">
                <v-form @submit.prevent="handleLogin" ref="loginForm">
                  <div class="field-spacing"></div>
                  <v-text-field v-model="loginData.email" :rules="[rules.required, rules.email]" label="Email"
                    prepend-inner-icon="mdi-email" variant="outlined" density="comfortable" />

                  <v-text-field v-model="loginData.password" :rules="[rules.required, rules.password]"
                    label="Mot de passe" prepend-inner-icon="mdi-lock"
                    :append-inner-icon="showLoginPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showLoginPassword = !showLoginPassword"
                    :type="showLoginPassword ? 'text' : 'password'" variant="outlined" density="comfortable"
                    class="mt-4" />

                  <v-alert v-if="loginError" type="error" variant="tonal" class="mb-4" closable>
                    {{ loginError }}
                  </v-alert>

                  <div class="d-flex justify-end mt-4">
                    <v-btn color="primary" type="submit" :loading="isLoading" min-width="120">
                      Login
                    </v-btn>
                  </div>
                </v-form>
              </v-window-item>

              <!-- Register Form -->
              <v-window-item value="register">
                <v-form @submit.prevent="handleRegister" ref="registerForm">
                  <v-text-field v-model="registerData.firstname" :rules="[rules.required]" label="Prenom"
                    prepend-inner-icon="mdi-account" variant="outlined" density="comfortable" class="mt-4" />

                  <v-text-field v-model="registerData.lastname" :rules="[rules.required]" label="Nom"
                    prepend-inner-icon="mdi-account" variant="outlined" density="comfortable" class="mt-4" />

                  <v-text-field v-model="registerData.email" :rules="[rules.required, rules.email]" label="Email"
                    prepend-inner-icon="mdi-email" variant="outlined" density="comfortable" class="mt-4" />

                  <v-text-field v-model="registerData.tel" :rules="[rules.required, rules.phone]" label="Téléphone"
                    prepend-inner-icon="mdi-phone" variant="outlined" density="comfortable" class="mt-4"
                    bg-color="white" type="tel"/>

                  <v-text-field v-model="registerData.password" :rules="[rules.required, rules.password]"
                    label="Mot de passe" prepend-inner-icon="mdi-lock"
                    :append-inner-icon="showRegisterPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showRegisterPassword = !showRegisterPassword"
                    :type="showRegisterPassword ? 'text' : 'password'" variant="outlined" density="comfortable"
                    class="mt-4" />

                  <v-text-field v-model="registerData.confirmPassword"
                    :rules="[rules.required, passwordConfirmationRule]" label="Confirmation de mot de passe"
                    prepend-inner-icon="mdi-lock-check" :type="showRegisterPassword ? 'text' : 'password'"
                    variant="outlined" density="comfortable" class="mt-4" />

                  <v-alert v-if="registerError" type="error" variant="tonal" class="mb-4" closable>
                    {{ registerError }}
                  </v-alert>

                  <div class="d-flex justify-end mt-4">
                    <v-btn color="primary" type="submit" :loading="isLoading" min-width="120">
                      Register
                    </v-btn>
                  </div>
                </v-form>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import AuthService from '../service/AuthService';

// Router and store setup
const router = useRouter();
const userStore = useUserStore();

// Form refs for validation
const loginForm = ref(null);
const registerForm = ref(null);

// UI state
const activeTab = ref('login');
const isLoading = ref(false);
const showLoginPassword = ref(false);
const showRegisterPassword = ref(false);
const loginError = ref('');
const registerError = ref('');

// Form data
const loginData = ref({
  email: '',
  password: ''
});

const registerData = ref({
  firstname: '',
  lastname: '',
  tel: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// Validation rules
const rules = {
  required: v => !!v || 'Ce champs est obligatoire',
  email: v => /.+@.+\..+/.test(v) || 'Veuillez entrer une adresse mail valide',
  password: v => v?.length >= 8 || 'Votre mot de passe doit contenir au moins 8 caractères',
  phone: v => {
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return phoneRegex.test(v) || 'Veuillez entrer un numéro de téléphone valide';
  }
};

const passwordConfirmationRule = computed(() => {
  return v => v === registerData.value.password || 'Les mots de passes doivent être équivalent'
});

const handleLogin = async (credentials = null) => {
  // If credentials are provided, use them. Otherwise use loginData
  const loginCredentials = credentials || loginData.value;
  
  const { valid } = credentials ? true : await loginForm.value.validate();
  if (!valid) return;

  isLoading.value = true;
  loginError.value = '';

  try {
    const response = await AuthService.login(loginCredentials);
    const token = AuthService.getToken();
    const userData = AuthService.getUserData(token);
    userStore.setUser(userData);
    router.push('/');
  } catch (error) {
    loginError.value = error.response?.data?.message || "La connexion à échoué, veuillez réessayer";
  } finally {
    isLoading.value = false;
  }
};

const handleRegister = async () => {
  const { valid } = await registerForm.value.validate();
  if (!valid) return;

  isLoading.value = true;
  registerError.value = '';

  try {
    await AuthService.register({
      prenom: registerData.value.firstname,
      nom: registerData.value.lastname,
      email: registerData.value.email,
      tel: registerData.value.tel,
      password: registerData.value.password
    });

    // Create credentials object for login
    const credentials = {
      email: registerData.value.email,
      password: registerData.value.password
    };

    // Call handleLogin with the credentials
    await handleLogin(credentials);
  } catch (error) {
    registerError.value = error.response?.data?.message || "L'inscription à échoué, veuillez réessayer";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.auth-card {
  width: 100%;
}

.field-spacing {
  margin-bottom: 8px;
}

/* Add responsive padding */
@media (min-width: 600px) {
  .v-card-text {
    padding: 32px;
  }
}
</style>