<template>
  <v-container>
    <v-card>
      <v-card-title>{{ isOwnProfile ? 'Mon Profil' : 'Profil de ' + user.nom + ' ' + user.prenom }}</v-card-title>
      <v-card-text>
        <v-form ref="formRef" lazy-validation :disabled="!isOwnProfile">
          <v-avatar size="150" class="mb-4">
            <v-img v-if="user.image" :src="user.image" alt="Avatar"></v-img>
          </v-avatar>

          <v-file-input v-if="isOwnProfile" v-model="selectedImage" accept="image/*" label="Changer d'image"
            @change="changeImage"></v-file-input>

          <v-text-field v-model="user.nom" label="Nom" :rules="isOwnProfile ? [rules.required] : []"
            :readonly="!isOwnProfile"></v-text-field>
          <v-text-field v-model="user.prenom" label="Prénom" :rules="isOwnProfile ? [rules.required] : []"
            :readonly="!isOwnProfile"></v-text-field>
          <v-text-field v-model="user.email" label="Email" :rules="isOwnProfile ? [rules.required, rules.email] : []"
            :readonly="!isOwnProfile"></v-text-field>
          <v-text-field v-model="user.tel" label="Numéro de téléphone" :rules="isOwnProfile ? [rules.required] : []"
            :readonly="!isOwnProfile"></v-text-field>
        </v-form>

        <v-btn v-if="isOwnProfile" color="primary" class="mt-4" @click="saveProfile" :disabled="loading"
          :loading="loading">
          Sauvegarder
        </v-btn>

        <!-- Section commentaire et note pour les profils des autres -->
        <v-row v-if="!isOwnProfile" class="mt-6">
          <v-col>
            <h3>Laisser un avis</h3>
            <v-form ref="reviewForm" lazy-validation>
              <v-rating v-model="rating" color="yellow darken-3" background-color="grey lighten-1" length="5" size="32"
                class="mb-4"></v-rating>
              <v-textarea v-model="comment" label="Commentaire" rows="3" :rules="[rules.requiredComment]"
                outlined></v-textarea>
              <v-btn color="primary" @click="submitReview" :disabled="reviewLoading" :loading="reviewLoading">
                Envoyer l’avis
              </v-btn>
            </v-form>
          </v-col>
        </v-row>

        <!-- Affichage des commentaires et note moyenne -->
        <v-row class="mt-6">
          <v-col>
            <h3>Avis reçus</h3>
            <div v-if="reviews.length > 0">
              <p>
                Note moyenne :
                <v-rating :value="averageRating" color="yellow darken-3" background-color="grey lighten-1" length="5"
                  size="24" readonly half-increments dense></v-rating>
                ({{ averageRating.toFixed(1) }} / 5)
              </p>
              <v-list>
                <v-list-item v-for="review in reviews" :key="review._id">
                  <v-list-item-content>
                    <v-list-item-title>
                      <v-rating :value="Number(review.rating)" color="yellow darken-3" background-color="grey lighten-1"
                        length="5" size="20" readonly dense></v-rating>
                      <!-- Ajout pour débogage -->
                      <span class="ml-2 text-caption">({{ review.rating }})</span>
                    </v-list-item-title>
                    <v-list-item-subtitle>{{ review.comment }}</v-list-item-subtitle>
                    <v-list-item-subtitle class="text-caption text-grey">
                      Par {{ review.reviewerId.nom || 'Utilisateur' }} le
                      {{ new Date(review.date).toLocaleDateString('fr-FR') }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
            <p v-else>Aucun avis pour le moment.</p>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import UserService from '@/service/userService.js';
import AuthService from '@/service/AuthService.js';

const route = useRoute();
const user = ref({});
const selectedImage = ref(null);
const formRef = ref(null);
const loading = ref(false);
const rating = ref(0);
const comment = ref('');
const reviewForm = ref(null);
const reviewLoading = ref(false);
const reviews = ref([]);

const isOwnProfile = computed(() => !route.params.id);

const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0;
  const total = reviews.value.reduce((sum, review) => sum + review.rating, 0);
  return total / reviews.value.length;
});

const rules = reactive({
  required: value => !!value || 'Requis.',
  email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Email invalide.',
  requiredComment: value => !!value || 'Le commentaire est requis.',
});

onMounted(async () => {
  try {
    const currentUserId = AuthService.getCurrentUserId();
    const profileId = route.params.id || currentUserId;

    console.log('Chargement du profil pour ID:', profileId);
    const userData = await UserService.getUserById(profileId);
    user.value = userData;
    console.log('Données utilisateur chargées:', user.value);

    const reviewData = await UserService.getReviewsByUserId(profileId);
    console.log('Données brutes des commentaires reçues:', reviewData);
    reviews.value = reviewData;
    console.log('Commentaires assignés:', reviews.value);
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error);
  }
});

const changeImage = () => {
  if (selectedImage.value) {
    console.log("Image sélectionnée:", selectedImage.value);
  }
};

const saveProfile = async () => {
  if (!isOwnProfile.value) return;
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

    console.log("Payload à envoyer:", formData);

    const updatedUser = await UserService.updateUser(user.value._id, formData);
    user.value = updatedUser;
    console.log('Profil mis à jour:', updatedUser);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du profil:", error);
  } finally {
    loading.value = false;
  }
};

const submitReview = async () => {
  if (!reviewForm.value || !(await reviewForm.value.validate())) return;

  try {
    reviewLoading.value = true;

    const reviewData = {
      reviewerId: AuthService.getCurrentUserId(),
      rating: rating.value,
      comment: comment.value,
    };

    console.log('Envoi de l’avis:', reviewData);
    await UserService.submitUserReview(user.value._id, reviewData);
    console.log('Avis soumis avec succès');

    // Recharger les commentaires après soumission
    const updatedReviews = await UserService.getReviewsByUserId(user.value._id);
    reviews.value = updatedReviews;

    // Réinitialiser le formulaire
    rating.value = 0;
    comment.value = '';
    reviewForm.value.resetValidation();
  } catch (error) {
    console.error("Erreur lors de la soumission de l’avis:", error);
  } finally {
    reviewLoading.value = false;
  }
};
</script>