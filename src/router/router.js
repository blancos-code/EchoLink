import {createMemoryHistory, createRouter, createWebHistory} from 'vue-router'
import Layout from '@/layout/Layout.vue'
import Map from '@/views/Map.vue'
import Messages from '@/views/Messages.vue'
import Forum from '@/views/Forum.vue'
import Classement from "@/views/Classement.vue";

const routes = [
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: '/map',
                name: 'map',
                component: Map
            },
            {
                path: '/messages',
                name: 'messages',
                component: Messages
            },
            {
                path: '/forum',
                name: 'forum',
                component: Forum
            },
            {
                path: '/classement',
                name: 'classement',
                component: Classement
            }
        ]
    },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})