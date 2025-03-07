<template>
  <div id="map" class="ma-0" style="height: 600px; width: 100%;"></div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getMarkerColor, getPriorityRadius } from "@/utils/map.js";
import AuthService from "@/service/AuthService.js";
const emit = defineEmits(['resolve-alert']);

const router = useRouter();
const props = defineProps(['alerts', 'resolveAlert']);

let map;

onMounted(() => {
  map = L.map('map').setView([46.603354, 1.888334], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

  updateMap();
});

watch(() => props.alerts, updateMap, { deep: true });

function updateMap() {
  console.log("map  ", map)
  if (!map || !props.alerts) return;

  map.eachLayer(layer => {
    if (layer instanceof L.CircleMarker) {
      map.removeLayer(layer);
    }
  });

  props.alerts.forEach(alert => {
    const { zone_geographique, criticity, description, contact, userId, treated } = alert;
    const [lat, lng] = zone_geographique.split(';').map(Number);

    if (isNaN(lat) || isNaN(lng) || treated) return;

    const markerColor = getMarkerColor(criticity);
    const markerRadius = getPriorityRadius(criticity);
    const marker = L.circleMarker([lat, lng], {
      radius: markerRadius,
      fillColor: markerColor,
      color: 'white',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8,
      className: `priority-${criticity}`
    }).addTo(map);

    if (criticity === 'Urgence médicale') {
      marker.getElement()?.classList.add('pulse-animation');
    }

    const currentUserId = AuthService.getCurrentUserId();
    const isOwner = userId === currentUserId;

    let popupContent = `
      <div class="incident-popup">
        <div class="incident-header priority-${criticity}">
          <div class="incident-info">
            <h3>Criticity: ${criticity}</h3>
            <p class="incident-type">${description}</p>
          </div>
        </div>
        <div class="incident-details">
          <p><strong>Lieu :</strong> ${zone_geographique}</p>
          <p><strong>Date :</strong> ${new Date(alert.date).toLocaleDateString('fr-FR') + ' - ' + new Date(alert.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
          <p><strong>Contact :</strong> ${contact}</p>
        </div>
        <button class="contact-btn">
          Venir en aide
        </button>
    `;
  if(isOwner){
    popupContent += `<button class="resolve-btn">Fermer l'urgence</button>`;
  }
  popupContent +=`</div>`;

    marker.bindPopup(popupContent, {
      maxWidth: 300,
      className: `incident-popup priority-${criticity}`
    });

    marker.on('popupopen', () => {
      const btn = document.querySelector('.contact-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          console.log('Redirection vers /messages/' + userId);
          router.push(`/messages?c=${userId}`);
        }, { once: true });
      } else {
        console.error('Bouton .contact-btn non trouvé');
      }
      if (isOwner) {
        const resolveBtn = document.querySelector('.resolve-btn');
        if (resolveBtn) {
          resolveBtn.addEventListener('click', () => {
            emit('resolve-alert', alert);
            marker.closePopup();
          }, { once: true });
        } else {
          console.error('Bouton .resolve-btn non trouvé');
        }
      }

    });
  });
}
</script>

<style scoped>
@import "@/assets/css/components/map.css";
</style>
