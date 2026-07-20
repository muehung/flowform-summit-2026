import { createApp } from 'vue'
import './main.css' // 有tailwind
import router from './router/router.js'
import App from './App.vue'

createApp(App)
    .use(router)
    .mount('#app')
