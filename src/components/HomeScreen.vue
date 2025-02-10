<template>
  <div class="home">
    <h1>Welcome Home!</h1>
    <p>This is the home page of your application.</p>

    <router-link to="/login">
      <button class="login-button">Login</button>
    </router-link>

    <router-link to="/conversations">About us</router-link>

  </div>
</template>

<script setup>
import Nav from "./Nav.vue";

</script>

<style scoped>
.home {
  text-align: center; /* Center the content */
  padding: 20px; /* Add some padding */
}

.login-button {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 10px;
  cursor: pointer;
  border-radius: 5px; /* Add rounded corners */
}
</style>