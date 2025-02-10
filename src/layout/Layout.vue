<template>
  <v-app>
      <v-layout>
        <v-navigation-drawer
            permanent
        >
          <template v-slot:prepend>
            <div
              class="d-inline-flex"
            >
              <v-img
                  src="/src/assets/images/logo.png"
                  alt=""
                  width="28px"
                  class="ml-2"
              />
              <v-card-title class="mt-1">
                EchoLink
              </v-card-title>
            </div>
          </template>

          <template v-slot:append>
            <v-list-item
                lines="two"
                prepend-avatar="https://randomuser.me/api/portraits/women/81.jpg"
                subtitle="En ligne"
                title="Jane Smith"
            >
              <template #append>
                <v-btn
                  icon="mdi-bell"
                  variant="text"
                />
              </template>
            </v-list-item>
            <div class="pa-2">
              <v-btn
                block
                variant="flat"
                color="error"
              >
                Déconnexion
              </v-btn>
            </div>
          </template>

          <v-divider></v-divider>

          <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-map" title="Carte des urgences" value="map"></v-list-item>
            <v-list-item prepend-icon="mdi-message" title="Messages" value="messages"></v-list-item>
            <v-list-item prepend-icon="mdi-forum" title="Forum" value="forum"></v-list-item>
            <v-list-item prepend-icon="mdi-podium" title="Classementsy" value="ranking"></v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-main>
          <v-container fluid>
            <router-view />
          </v-container>
        </v-main>
      </v-layout>
  </v-app>
</template>
<script setup lang="ts">
</script>