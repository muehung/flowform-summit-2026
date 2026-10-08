import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from '../stores/useAuthStore.js';
import Step01View from '../views/step01View.vue';
import Step02View from '../views/step02View.vue';
import Step03View from '../views/step03View.vue';
import Step04View from '../views/step04View.vue';
import successView from '../views/successView.vue';
import loginView from '../views/loginView.vue';
import dashboardView from '../views/dashboardView.vue';
import NotFoundView from '../components/NotFound.vue';
import AuthErrorView from '../components/AuthError.vue'

async function canUserAccess(){
    const authStore = useAuthStore();
    if(!authStore.sessionChecked) {
        await authStore.restoreSession();
    }
    return authStore.isLoggedIn;
}

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/step01' },
        { path: '/step01', component: Step01View },
        { path: '/step02', component: Step02View },
        { path: '/step03', component: Step03View },
        { path: '/step04', component: Step04View },
        { path: '/success', component: successView },
        { path: '/login', component: loginView },
        { path: '/dashboard', component: dashboardView, beforeEnter: async ()=>{
            try {
                const canAccess = await canUserAccess();
                if(!canAccess) return '/login';
            } catch (error) {
                // 暫時無法確認則顯示錯誤或重試，避免直接放行。
                console.error('無法確認登入狀態', error);
                return '/auth-error'
            }
        } },
        { path: '/:pathMatch(.*)', component: NotFoundView },
        { path: '/auth-error', component: AuthErrorView }
    ],
});

export default router