<template>
  <v-card>
    <v-card-title>Créer une nouvelle urgence</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" @submit.prevent="createAlert">
        <v-text-field
            v-model="description"
            label="Description"
            :rules="titleRules"
            required
        ></v-text-field>

        <v-select
            v-model="criticity"
            label="Criticité"
            :items=incidentTypes
            required
        ></v-select>

        <v-btn
            color="primary"
            type="submit"
            :disabled="!valid"
            class="mr-2"
        >
          Créer
        </v-btn>
        <v-btn @click="$emit('cancel')">Annuler</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import {ref} from 'vue'
import AlertService from "@/service/AlertService.js";
import AuthService from "@/service/AuthService.js";
import UserService from "@/service/userService.js";
import {incidentTypes} from "@/utils/map.js";

const emit = defineEmits(['alert-created', 'cancel'])

const description = ref('')
const criticity = ref('')
const zone_geographique = ref('')
const valid = ref(false)
const form = ref(null)

const titleRules = [
  v => !!v || 'La description est requise',
  v => (v && v.length <= 100) || 'La description doit faire moins de 100 caractères'
]


const createAlert = async () => {
  try {
    zone_geographique.value = "48.866667;2.333333"; //paris by default
   navigator.geolocation.getCurrentPosition((position) =>{
      zone_geographique.value = `${position.coords.latitude};${position.coords.longitude}`;
    })
    let user = await UserService.getUserById(AuthService.getCurrentUserId());

  const newAlert = await AlertService.createAlert({
    userId: AuthService.getCurrentUserId(),
    description: description.value,
    criticity: criticity.value,
    contact: user?.tel,
    zone_geographique: zone_geographique.value,
  })
    emit('alert-created', newAlert)
    // Réinitialisation du formulaire
    description.value = ''
    criticity.value = ''
    zone_geographique.value = ''
    form.value.resetValidation()
  } catch (error) {
    console.error('Erreur lors de la création de l alerte:', error)
  }
}
</script>