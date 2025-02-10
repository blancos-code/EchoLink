import { createMemoryHistory, createRouter } from 'vue-router'
import Layout from '@/layout/Layout.vue'
import Map from '@/views/Map.vue'

const routes = [
    {
        path: '/',
        component: Layout,
        children: [
            { path: '', component: Map }
        ]
    },
]

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
})