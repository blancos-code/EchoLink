import { createWebHistory, createRouter } from 'vue-router' // Import createWebHistory

import HomeScreen from '../components/HomeScreen.vue';
import RegisterScreen from "../components/RegisterScreen.vue";
import ConversationList from "../components/ConversationList.vue";
import ChatWindow from "../components/ChatWindow.vue";
import LoginScreen from "../components/LoginScreen.vue";

const routes = [
    { path: '/', component: HomeScreen },
    { path: '/register', component: RegisterScreen },
    { path: '/conversations', component: ConversationList },
    { path: '/chat', component: ChatWindow },
    { path: '/login', component: LoginScreen },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router