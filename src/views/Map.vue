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
      <LeafletMap :alerts="alerts"/>
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

onMounted(async () => {
  alerts.value = await AlertService.getAllAlerts();
  setupSocketListeners();
});

const setupSocketListeners = () => {
  socketClient.socket?.on('new_alert', (alert) => {
    alerts.value.push(alert);
  });
};

const handleAlertCreated = (newAlert) => {
  alerts.value.push(newAlert);
  showCreateAlertDialog.value = false;
};
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

