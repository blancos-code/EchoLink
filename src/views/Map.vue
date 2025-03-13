<template>
  <v-dialog v-model="showCreateAlertDialog" persistent width="500">
    <create-alert-dialog @alert-created="handleAlertCreated" @cancel="showCreateAlertDialog = false"></create-alert-dialog>
  </v-dialog>
  <v-row>
    <v-col cols="4">
      <v-card class="pr-5 mb-5 bg-white" variant="outlined">
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
      
      <!-- Nearby alerts section -->
      <v-card class="mb-5 bg-white" variant="outlined">
        <v-card-title class="d-flex align-center">
          Alertes près de chez vous
          <v-spacer></v-spacer>
          <v-btn icon @click="refreshNearbyAlerts" :loading="loadingNearby">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-subtitle v-if="userLocation">
          {{ distanceFilter / 1000 }} km autour de votre position
        </v-card-subtitle>
        <v-card-subtitle v-else class="text-warning">
          <v-icon>mdi-alert</v-icon> Position non disponible
        </v-card-subtitle>
        
        <v-card-text>
          <v-slider
            v-model="distanceFilter"
            :min="1000"
            :max="50000"
            :step="1000"
            thumb-label="always"
            label="m"
            @update:modelValue="refreshNearbyAlerts"
          ></v-slider>
          
          <div v-if="loadingNearby" class="d-flex justify-center my-4">
            <v-progress-circular indeterminate></v-progress-circular>
          </div>
          
          <div v-else-if="nearbyAlerts.length === 0" class="text-center pa-4">
            <v-icon size="large" color="grey">mdi-map-marker-off</v-icon>
            <div class="text-body-1 text-grey mt-2">Aucune alerte à proximité</div>
          </div>
          
          <v-list v-else>
            <v-list-item 
              v-for="alert in nearbyAlerts" 
              :key="alert._id"
              :subtitle="formatDate(alert.date)"
              :prepend-icon="getAlertIcon(alert.criticity)"
              :title="alert.description"
              :value="alert"
              @click="centerMapOn(alert)"
            >
              <template v-slot:append>
                <v-chip
                  :color="getAlertColor(alert.criticity)"
                  size="small"
                  class="text-white"
                >
                  {{ alert.criticity }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
      
      <v-card class="bg-white" variant="outlined">
        <v-card-title>
          Actions
        </v-card-title>
        <v-card-actions>
          <v-btn color="error" class="ml-2" variant="outlined" prepend-icon="mdi-alert-outline" @click="showCreateAlertDialog = true">
            Signaler une urgence
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col>
      <LeafletMap ref="mapRef" :alerts="alerts" @resolve-alert="resolveAlert"/>
    </v-col>
  </v-row>
</template>

<script setup>
import LeafletMap from '@/components/LeafletMap.vue';
import { onMounted, ref } from 'vue';
import CreateAlertDialog from "@/components/CreateAlertDialog.vue";
import AlertService from "@/service/AlertService.js";
import socketClient from "@/utils/socket.js";

const showCreateAlertDialog = ref(false);
const alerts = ref([]);
const nearbyAlerts = ref([]);
const userLocation = ref(null);
const distanceFilter = ref(10000); // 10km default
const loadingNearby = ref(false);
const mapRef = ref(null);

onMounted(async () => {
  await socketClient.connect();
  alerts.value = await AlertService.getAllAlerts();
  setupSocketListeners();
  getUserLocation();
});

const setupSocketListeners = () => {
  socketClient.socket?.on('new_alert', (alert) => {
    alerts.value.push(alert);
    refreshNearbyAlerts();
  });
  socketClient.socket?.on('alert_resolved', (alert) => {
    alerts.value = alerts.value.filter(a => a._id !== alert._id);
    nearbyAlerts.value = nearbyAlerts.value.filter(a => a._id !== alert._id);
  });
};

const handleAlertCreated = (newAlert) => {
  alerts.value.push(newAlert);
  refreshNearbyAlerts();
  showCreateAlertDialog.value = false;
};

async function resolveAlert(alert) {
  AlertService.resolveAlert(alert._id).then(async () => {
    alerts.value = await AlertService.getAllAlerts();
    refreshNearbyAlerts();
    return true;
  });
}

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.value = `${position.coords.latitude};${position.coords.longitude}`;
        refreshNearbyAlerts();
      },
      (error) => {
        console.error("Error getting user location:", error);
        userLocation.value = null;
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
    userLocation.value = null;
  }
}

async function refreshNearbyAlerts() {
  if (!userLocation.value) {
    getUserLocation();
    return;
  }
  
  loadingNearby.value = true;
  try {
    nearbyAlerts.value = await AlertService.getNearbyAlerts(
      userLocation.value, 
      distanceFilter.value
    );
  } catch (error) {
    console.error("Failed to fetch nearby alerts:", error);
  } finally {
    loadingNearby.value = false;
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR') + ' - ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function getAlertIcon(criticity) {
  switch (criticity) {
    case 'Urgence médicale': return 'mdi-hospital-box';
    case 'Problème de sécurité': return 'mdi-shield-alert';
    default: return 'mdi-hand-heart';
  }
}

function getAlertColor(criticity) {
  switch (criticity) {
    case 'Urgence médicale': return 'orange';
    case 'Problème de sécurité': return 'black';
    default: return 'blue';
  }
}

function centerMapOn(alert) {
  if (!mapRef.value || !alert.zone_geographique) return;
  
  const [lat, lng] = alert.zone_geographique.split(';').map(Number);
  if (isNaN(lat) || isNaN(lng)) return;
  
  // Access the map instance through the ref and call a method to center on coordinates
  mapRef.value.centerOnCoords(lat, lng);
}
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

