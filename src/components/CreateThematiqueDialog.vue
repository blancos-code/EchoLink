<template>
  <v-card>
    <v-card-title>Créer une nouvelle thématique</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" @submit.prevent="createThematique">
        <v-text-field
            v-model="titre"
            label="Titre"
            :rules="titleRules"
        required
        ></v-text-field>

        <v-btn
            color="primary"
            type="submit"
            :disabled="!valid"
            class="mr-2"
        >
          Créer
        </v-btn>
        <v-btn @click="emit('cancel')">Annuler</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref , defineEmits} from 'vue';
import ThematiqueService from '../service/ThematiqueService';

const titre = ref('');
const valid = ref(false);
const titleRules = [(v) => !!v || 'Title is required', (v) => (v && v.length <= 50) || 'Title must be less than 50 characters'];
const form = ref(null);

const emit = defineEmits(['thematique-created', 'cancel']);
const createThematique = async () => {
  try {
    const newThematique = await ThematiqueService.createThematique({ titre: titre.value });
    emit('thematique-created', newThematique.data);

    titre.value = '';
    form.value.resetValidation();

  } catch (error) {
    console.error('Error creating thematique:', error);
  }
};
</script>