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
              @click="accessProfile"
              lines="two"
              :prepend-avatar='user != null && user.image != null ? API_URL + user.image : "https://randomuser.me/api/portraits/women/81.jpg"'
              subtitle="En ligne"
              :title='user!= null ? `${user.prenom} ${user.nom}` : ""'
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
                @click="logout"
            >
              Déconnexion
            </v-btn>
          </div>
        </template>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <router-link
              v-for="route in routes"
              :to="route.name"
              style="color: black; text-decoration: none;"
          >
            <v-list-item
                :prepend-icon="route.icon"
                :title="route.title"
                :value="route.name"
            />
          </router-link>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <v-container fluid>
          <router-view/>
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>
<script setup>
  import AuthService from "@/service/AuthService.js";
  import {onMounted, onUpdated, ref} from "vue";
  import {router} from "@/router/router.js";
  import UserService from "@/service/userService.js";
  const user = ref(null);
  const API_URL = "http://localhost:4000";
  const routes = ref([
    {title: 'Carte des urgences', icon: 'mdi-map', name: 'map'},
    {title: 'Messages', icon: 'mdi-message', name: 'messages'},
    {title: 'Forum', icon: 'mdi-forum', name: 'forum'},
    {title: 'Classement', icon: 'mdi-podium', name: 'classement'},
  ])

 onMounted( () => {
   updateUser();
 });

  onUpdated(() => {
    updateUser();
  } )

  const updateUser = async () => {
    user.value = await UserService.getUserById(AuthService.getCurrentUserId());
  }
  const logout = () =>{
    AuthService.logout();
    router.push('/login');
  };

  const accessProfile = () => {
    router.push('/profile');
  };
</script>