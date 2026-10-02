<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore'

const useAuth = useAuthStore();
const { isLoggedIn } = storeToRefs(useAuth);
const router = useRouter();

const handleLogout = async () => {
  await useAuth.logout();
  await router.replace('/login')
  console.log('isLoggedIn: ', isLoggedIn.value)
}
</script>

<template>
  <header
    class="top-0 left-0 right-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
    <div class="h-[2px] w-full bg-gradient-to-r from-gradient-start via-gradient-middle to-gradient-end"></div>
    <div class="h-16 w-full px-gutter flex items-center justify-between">
      <div class="flex items-center gap-6">
        <RouterLink to="/">
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-on-primary font-headline-md text-headline-md font-bold">
              F</div>
            <span class="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">FlowForm
              <span class="font-body-md text-body-md text-on-surface-variant font-normal">管理後台</span></span>
          </div>
        </RouterLink>

        <!-- <nav class="hidden md:flex items-center gap-6 ml-4" data-active-classes="text-secondary font-headline-md">
          <a aria-current="page" class="transition-colors text-secondary font-headline-md" data-path="registration-list"
            href="#">報名資料</a>
          <a class="text-on-surface-variant font-body-md text-body-md hover:text-on-surface transition-colors"
            data-path="seminar-overview" href="#">場次總覽</a>
          <a class="text-on-surface-variant font-body-md text-body-md hover:text-on-surface transition-colors"
            data-path="system-settings" href="#">系統設定</a></nav> -->
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-3 pl-3 py-1 pr-2 rounded-full">
          <RouterLink v-if="!isLoggedIn" to="/login"
            class="text-on-surface-variant bg-white hover:bg-secondary hover:text-white   hover:shadow-primary/20 transition-all text-md  rounded-lg shadow-md flex items-center justify-center px-5 py-2">
            登入
          </RouterLink>
          <div v-else class="flex items-center gap-3 pl-3 py-1 pr-2 rounded-full bg-surface-container-low">
            <!-- <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span
                    class="material-symbols-outlined text-on-primary text-[18px]">person</span></div> -->
              <div
                class="material-symbols-outlined text-on-surface-variant hover:text-secondary transition-colors text-2xl w-8 h-8 text-center">
                account_circle</div>
              <div class="hidden sm:flex flex-col text-left"><span
                  class="font-body-md text-body-md font-semibold text-on-surface leading-tight">Admin</span><span
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
    </div>
  </header>


</template>