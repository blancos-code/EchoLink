<template>
  <v-app>
    <Nav />
    <v-main> <router-view /> </v-main> </v-app>
</template>

<script setup>
import Nav from "./components/Nav.vue";
import { RouterView } from 'vue-router'
</script>

<style>
  body {
    margin: 0;
  }
</style>