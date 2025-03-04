<template>
  <div id="map" class="ma-0" style="height: 600px; width: 100%;"></div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { getMarkerColor, getPriorityRadius } from "../utils/map.js";
import { frenchCities, incidentTypes, incidentDescriptions, priorityLevels } from "../utils/map.js";

const router = useRouter();

onMounted(async () => {
  console.log('Carte montée');
  const map = L.map('map').setView([46.603354, 1.888334], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

  try {
    const response = await axios.get('https://randomuser.me/api/?results=8&nat=fr');
    const users = response.data.results;

    users.forEach((user, index) => {
      const city = frenchCities[index % frenchCities.length];
      const incidentType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
      const incidents = incidentDescriptions[incidentType];
      const incident = incidents[Math.floor(Math.random() * incidents.length)];

      const markerColor = getMarkerColor(incidentType);
      const markerRadius = getPriorityRadius(incident.priority);
      const marker = L.circleMarker([city.lat, city.lng], {
        radius: markerRadius,
        fillColor: markerColor,
        color: 'white',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
        className: `priority-${incident.priority}`
      }).addTo(map);

      if (incident.priority === 1) {
        marker.getElement()?.classList.add('pulse-animation');
      }

      const popupContent = `
        <div class="incident-popup">
          <div class="incident-header priority-${incident.priority}">
            <img src="${user.picture.medium}" alt="Photo du déclarant" class="reporter-img"/>
            <div class="incident-info">
              <h3>${user.name.first} ${user.name.last}</h3>
              <p class="incident-type">${incidentType}</p>
              <span class="priority-badge">
                Priorité : ${priorityLevels[incident.priority]}
              </span>
            </div>
          </div>
          <div class="incident-details">
            <p><strong>Lieu :</strong> ${city.name}</p>
            <p><strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
            <p><strong>Description :</strong> ${incident.desc}</p>
            <p><strong>Contact :</strong> ${user.phone}</p>
          </div>
          <button class="contact-btn">
            Venir en aide
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: `incident-popup priority-${incident.priority}`
      });

      marker.on('popupopen', () => {
        const btn = document.querySelector('.contact-btn');
        const userID = "67c73e0cf35ee80fb535dc5e"; // TODO envoie l'id de l'user @Sacha
        if (btn) {
          btn.addEventListener('click', () => { 
            console.log('Redirection vers /messages/' + userID);
            router.push(`/messages?c=${userID}`);
          }, { once: true });
        } else {
          console.error('Bouton .contact-btn non trouvé');
        }
      });
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
  }
});
</script>

<style scoped>
@import "@/assets/css/components/map.css";
</style>