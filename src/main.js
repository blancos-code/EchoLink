// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

const app = createApp(App)

app.use(createPinia())
app.use(vuetify)
app.use(router)

app.mount('#app')