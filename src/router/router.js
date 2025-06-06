import { createRouter, createWebHistory} from 'vue-router'
import Layout from '@/layout/Layout.vue'
import Map from '@/views/Map.vue'
import Messages from '@/views/Messages.vue'
import Forum from '@/views/Forum.vue'
import Classement from "@/views/Classement.vue";
import Auth from "@/views/Auth.vue";
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
            },
            {
                path: '/profile/:id',
                name: 'OtherProfile',
                component: Profile
              },
        ]
    },
    {
        path: '/auth',
        name: 'auth',
        component: Auth
    },
]



export const router = createRouter({
    history: createWebHistory(),
    routes,
})


router.beforeEach(async (to, from, next) => {
    const isLoggedIn = await AuthService.isAuthenticated();
    console.log("is logged", isLoggedIn);

    if (!isLoggedIn) {
        if (to.name === 'auth') {
            next();
        } else {
            next('/auth');
            return;
        }
    }
    if ((to.path === '/' || to.path === '/auth') && isLoggedIn) {
        next('/map');
        return;
    }
    next();
});