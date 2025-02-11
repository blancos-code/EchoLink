<template>
  <v-card>
    <v-card-title>
      Créer un nouveau forum
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" @submit.prevent="createForum">
        <v-text-field
            v-model="titre"
            label="Titre"
            :rules="titleRules"
            required
        ></v-text-field>

        <v-select
            v-model="thematique"
            :items="thematiques"
            item-title="titre"
            item-value="_id"
            label="Thématique"
            :rules="requiredRules"
            required
        ></v-select>

        <v-text-field
            v-model="zone_geographique"
            label="Zone géographique"
            :rules="requiredRules"
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
import { ref, onMounted } from 'vue';
import ForumService from '../service/ForumService';
import ThematiqueService from "@/service/ThematiqueService";

const emit = defineEmits(['forum-created', 'cancel']);

const titre = ref('');
const thematique = ref(null);
const zone_geographique = ref('');
const thematiques = ref([]);

const valid = ref(false);
const titleRules = [(v) => !!v || 'Title is required', (v) => (v && v.length <= 50) || 'Title must be less than 50 characters'];
const requiredRules = [(v) => !!v || 'Ce champ est obligatoire'];
const form = ref(null);


onMounted(async () => {
  try {
    thematiques.value = await ThematiqueService.getAllThematiques();
  } catch (error) {
    console.error("Error fetching thematiques:", error);
  }
});

const createForum = async () => {
  try {
    const newForum = await ForumService.createForum({
      titre: titre.value,
      thematique: thematique.value,
      zone_geographique: zone_geographique.value
    });
    emit('forum-created', newForum); // Emit the new forum data


    // Reset form fields (optional)
    titre.value = '';
    thematique.value = null;
    zone_geographique.value = '';
    form.value.resetValidation();

  } catch (error) {
    console.error('Error creating forum:', error);
    // Handle error, display message to user, etc.
  }

};

</script>