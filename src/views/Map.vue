<template>
  <v-row>
    <v-col cols="4">
      <v-card
          class="pr-5 mb-5 bg-white"
          variant="outlined"
      >
        <v-card-title>
          Légende
        </v-card-title>
        <v-card-subtitle>
          Types d'incidents
        </v-card-subtitle>
        <v-card-item>
          <v-card-text>
            <div class="legend-item">
              <span class="dot medical"></span> Urgence médicale
            </div>
            <div class="legend-item">
              <span class="dot security"></span> Problème de sécurité
            </div>
            <div class="legend-item">
              <span class="dot assistance"></span> Besoin d'assistance
            </div>
          </v-card-text>
        </v-card-item>
      </v-card>
      <v-card
          class="bg-white"
          variant="outlined"
      >
        <v-card-title>
          Actions
        </v-card-title>
        <v-card-actions>
          <v-btn
              color="error"
              class="ml-2"
              variant="outlined"
              prepend-icon="mdi-alert-outline"
          >
            Signaler une urgence
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col>
      <LeafletMap/>
    </v-col>
  </v-row>
</template>

<script setup>
import LeafletMap from '../components/LeafletMap.vue';
</script>
<style>
.legend-item {
  display: flex;
  align-items: center;
  margin: 5px 0;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.medical {
  background-color: #ffa600;
}

.security {
  background-color: #000000;
}

.assistance {
  background-color: #00a7e3;
}
</style>