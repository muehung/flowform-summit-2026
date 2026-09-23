<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore'

const useAuth = useAuthStore();
const { isLoggedIn } = storeToRefs(useAuth);
const router = useRouter();

const handleLogout = async ()=>{
    await useAuth.goLogout();
    await router.replace('/login')
    console.log('isLoggedIn: ', isLoggedIn.value)
}

</script>

<template>
    <!-- TopAppBar -->
    <header class="bg-surface shadow-sm sticky top-0 z-50">
        <div class="flex justify-between items-center w-full px-gutter h-16 mx-auto">
            <div class="flex items-center gap-2">
                <RouterLink to="/" class="flex items-center gap-2">
                    <img src="/favicon.svg?v2" class="w-8 h-8" alt="">
                    <h1 class="font-headline-md text-headline-md font-black text-primary tracking-tight">FlowForm</h1>
                </RouterLink>
            </div>
            <div class="flex items-center gap-4">
                <RouterLink v-if="!isLoggedIn" to="/login"
                class="text-on-surface-variant bg-white hover:bg-secondary hover:text-white   hover:shadow-primary/20 transition-all text-md  rounded-lg shadow-md flex items-center justify-center px-5 py-2">登入
                </RouterLink>
                <div v-else
                 class="flex items-center gap-3 pl-3 py-1 pr-2 rounded-full bg-surface-container-low">
                <!-- <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span
                    class="material-symbols-outlined text-on-primary text-[18px]">person</span></div> -->
                    <div
                class="material-symbols-outlined text-on-surface-variant hover:text-secondary transition-colors text-2xl w-8 h-8 text-center">account_circle</div>
                <div class="hidden sm:flex flex-col text-left"><span
                    class="font-body-md text-body-md font-semibold text-on-surface leading-tight">王小華</span><span
                    class="font-label-mono text-label-mono text-on-surface-variant text-[11px] leading-tight">身分：管理員</span>
                </div>
                <div class="h-4 w-px bg-outline-variant mx-1 hidden sm:block"></div>
                <button @click="handleLogout"
                    class="flex items-center gap-1 text-on-surface-variant hover:text-error transition-colors px-2 py-1 rounded-lg text-label-mono font-label-mono text-md"
                    data-path="login" href="#"><span class="material-symbols-outlined text-md">logout</span><span
                    class="hidden sm:inline">登出</span>
                </button>
                </div>
            </div>
        </div>
    </header>
</template>