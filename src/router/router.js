import { createRouter, createWebHistory} from 'vue-router'
import Layout from '@/layout/Layout.vue'
import Map from '@/views/Map.vue'
import Messages from '@/views/Messages.vue'
import Forum from '@/views/Forum.vue'
import Classement from "@/views/Classement.vue";
import LoginScreen from "@/components/LoginScreen.vue";
import RegisterScreen from "@/components/RegisterScreen.vue";
import AuthService from "@/service/AuthService.js";
import Profile from "@/views/Profile.vue";

const routes = [
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: '/map',
                name: 'map',
                component: Map,
                meta: { requiresAuth: true }
            },
            {
                path: '/messages',
                name: 'messages',
                component: Messages,
                meta: { requiresAuth: true }
            },
            {
                path: '/forum',
                name: 'forum',
                component: Forum,
                meta: { requiresAuth: true }
            },
            {
                path: '/classement',
                name: 'classement',
                component: Classement,
                meta: { requiresAuth: true }
            },
            {
                path: '/profile',
                name: 'profile',
                component: Profile,
                meta: {requiresAuth: true}
            }

        ]
    },
    {
        path: '/login',
        name: 'login',
        component: LoginScreen
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterScreen
    },
]



export const router = createRouter({
    history: createWebHistory(),
    routes,
})


router.beforeEach(async (to, from, next) => { // Make beforeEach async
    const isLoggedIn = AuthService.isAuthenticated();
    console.log("is logged", isLoggedIn);

    if (!isLoggedIn) {
        if (to.name === 'login' || to.name === 'register') {
            next();
        } else {
            next('/login');
            return;
        }
    }
    if (to.path === '/' && isLoggedIn) {
        next('/map');
        return;
    }
    next();
});