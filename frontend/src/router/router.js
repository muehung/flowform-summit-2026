import { createRouter, createWebHistory } from "vue-router";

import HomeView from '../App.vue'
import Step01View from '../views/step01View.vue'
import Step02View from '../views/step02View.vue'
import Step03View from '../views/step03View.vue'
import Step04View from '../views/step04View.vue'
import NotFoundComponent from '../components/NotFoundComponent.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/step01'},
        { path: '/step01', component: Step01View},
        { path: '/step02', component: Step02View},
        { path: '/step03', component: Step03View},
        { path: '/step04', component: Step04View},
        { path: '/:pathMatch(.*)', component: NotFoundComponent }
    ],
})

export default router