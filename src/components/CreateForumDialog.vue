<template>
  <v-card>
    <v-card-title>Créer un nouveau forum</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" @submit.prevent="createForum">
        <v-text-field
          v-model="titre"
          label="Titre"
          :rules="titleRules"
          required
        ></v-text-field>

        <v-autocomplete
          v-model="selectedThematique"
          :items="thematiques"
          item-title="titre"
          item-value="_id"
          label="Thématique"
          :rules="requiredRules"
          required
          :no-data-text="newThematiqueInput ? 'Créer: ' + newThematiqueInput : 'Aucune thématique trouvée'"
          :custom-filter="filterThematiques"
          return-object
          @update:search="handleThematiqueSearch"
          clearable
        >
          <template v-slot:no-data>
            <v-list-item v-if="newThematiqueInput" @click="selectNewThematique">
              <v-list-item-title>
                Nouvelle thématique: "{{ newThematiqueInput }}"
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-autocomplete>

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
        <v-btn @click="$emit('cancel')">Annuler</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ForumService from '../service/ForumService'
import ThematiqueService from '../service/ThematiqueService'

const emit = defineEmits(['forum-created', 'cancel'])

const titre = ref('')
const selectedThematique = ref(null)
const zone_geographique = ref('')
const thematiques = ref([])
const newThematiqueInput = ref('') // Stocke la saisie pour une nouvelle thématique

const valid = ref(false)
const form = ref(null)

const titleRules = [
  v => !!v || 'Le titre est requis',
  v => (v && v.length <= 50) || 'Le titre doit faire moins de 50 caractères'
]
const requiredRules = [v => !!v || 'Ce champ est obligatoire']

onMounted(async () => {
  try {
    const response = await ThematiqueService.getAllThematiques()
    thematiques.value = Array.isArray(response) ? response : response.data
  } catch (error) {
    console.error('Erreur lors de la récupération des thématiques:', error)
  }
})

const filterThematiques = (itemTitle, queryText) => {
  return itemTitle.toLowerCase().includes(queryText.toLowerCase())
}

const handleThematiqueSearch = (searchText) => {
  if (!searchText) {
    newThematiqueInput.value = ''
    selectedThematique.value = null
    return
  }
  const lowerSearch = searchText.toLowerCase()
  const existingThematique = thematiques.value.find(t => t.titre.toLowerCase() === lowerSearch)
  if (existingThematique) {
    selectedThematique.value = existingThematique
    newThematiqueInput.value = ''
  } else {
    newThematiqueInput.value = searchText
    // Crée un objet temporaire pour que selectedThematique soit valide
    selectedThematique.value = { _id: null, titre: searchText }
  }
}

const selectNewThematique = () => {
  // Quand l’utilisateur clique sur "Nouvelle thématique", on le sélectionne
  selectedThematique.value = { _id: null, titre: newThematiqueInput.value }
}

const createForum = async () => {
  try {
    let thematiqueId
    let thematiqueObj

    if (selectedThematique.value && !selectedThematique.value._id) {
      const newThematiqueData = await ThematiqueService.createThematique({ titre: selectedThematique.value.titre })
      thematiqueId = newThematiqueData._id
      thematiqueObj = newThematiqueData
      thematiques.value.push(thematiqueObj)
    } else if (selectedThematique.value) {
      thematiqueId = selectedThematique.value._id
      thematiqueObj = selectedThematique.value
    } else {
      throw new Error('Aucune thématique sélectionnée ou créée')
    }

    const newForum = await ForumService.createForum({
      titre: titre.value,
      thematique: thematiqueId,
      zone_geographique: zone_geographique.value
    })

    // Attache l’objet thématique complet au forum pour ForumList
    newForum.thematique = thematiqueObj

    emit('forum-created', newForum)

    // Réinitialisation du formulaire
    titre.value = ''
    selectedThematique.value = null
    zone_geographique.value = ''
    newThematiqueInput.value = ''
    form.value.resetValidation()
  } catch (error) {
    console.error('Erreur lors de la création du forum:', error)
  }
}
</script>