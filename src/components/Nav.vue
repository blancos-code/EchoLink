<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/chat">Chat</router-link> |
    <router-link to="/conversations">Conversations</router-link> |
    <router-link to="/login">Login</router-link>
  </nav>
</template>

<style scoped>
nav {
  background-color: #f0f0f0; /* Light gray background */
  padding: 10px;
  border-bottom: 1px solid #ddd; /* Add a subtle bottom border */
}

nav a {
  padding: 5px 10px;
  text-decoration: none;
  color: #333; /* Dark gray text */
}

nav a:hover {
  background-color: #e0e0e0; /* Slightly darker gray on hover */
}

nav a.router-link-exact-active {
  font-weight: bold; /* Highlight the active link */
  color: #007bff;  /* Example: Blue color for active link */
}
</style>
<script setup lang="ts">
</script>