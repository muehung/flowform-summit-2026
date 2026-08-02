import { createApp } from 'vue'
import './main.css' // 有tailwind
import { createPinia } from 'pinia'
import router from './router/router.js'
import App from './App.vue'

const pinia = createPinia;

createApp(App)
    .use(pinia)
    .use(router)
    .mount('#app')
