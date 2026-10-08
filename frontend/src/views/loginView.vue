<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import dashboardNavbar from './../components/dashboardNavbar.vue';
import Footer from './../components/Footer.vue';
import { useAuthStore } from '../stores/useAuthStore.js';

const storeAuth = useAuthStore();
const { isLoggedIn } = storeToRefs(storeAuth);
const { login } = storeAuth;

// 驗證
const schemaForm = {
    account(val){
        if( !val || val?.trim() === "") { return "請填寫帳號" }
        if( val.length < 4 ) { return "請輸入超過 3 字元" }
        return true
    },
    password(val){
        if( !val || val?.trim() === "") {
            return "請填寫密碼"
        }
        if (val.length < 8 || val.length > 20 ) {
            return "密碼長度需在 8 到 20 個字元之間";
        }

        return true
    }
}

// vee-validate: values & errors，已經從 initialValues 綁定
const { values, errors, defineField, handleSubmit, validateField } = useForm({
    validationSchema: schemaForm,
    initialValues: { account: '', password: ''},
});


// UI connected
const [ account, accountProps ] = defineField('account');
const [ password, passwordProps ] = defineField('password');

const isPasswordVisible = ref(false);
const passwordInputType = computed(()=>{
    return isPasswordVisible.value ? 'text' : 'password'
});
function togglePasswordVisible(){
    isPasswordVisible.value = !isPasswordVisible.value;
}

const router = useRouter();
const loginError = ref("");
// vee-validate's handleSubmit
const goSubmit = handleSubmit(
    async (submitValues)=>{
        loginError.value = "";
        // useForm validationSchema 驗證通過才會繼續
        try {
            await login(account.value, password.value);
            await router.push('/dashboard')
        } catch (error){
            loginError.value = error
        }
    },
    async (ctx)=>{
        // validationSchema: schemaForm 指定規則 → handleSubmit 執行驗證 → 驗證失敗時，把錯誤放進第二個 callback 的 ctx.errors
        loginError.value = ctx.errors;
    }
);

</script>
<template>
    <!-- Top Navigation Accent -->
    <div class="h-2 w-full gradient-accent"></div>

    <!-- navbar -->
    <dashboardNavbar />

    <main class="w-full pt-16 bg-background min-h-screen">
        <div class="flex flex-col w-full items-center justify-center py-12 px-gutter relative overflow-hidden">
            <div
            class="w-full max-w-[460px] bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden transition-all">
            <div class="h-1.5 w-full bg-gradient-to-r from-gradient-start via-gradient-middle to-gradient-end"></div>
            <div class="p-8 sm:p-10 flex flex-col">
            <!-- Brand Header -->
            <div class="flex flex-col items-center text-center mb-8">
            <div
                class="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary font-headline-md text-headline-md font-bold mb-4 shadow-sm">
                F
            </div>
            <h1 class="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">登入 FlowForm</h1>
            <!-- <p class="font-body-md text-body-md text-on-surface-variant mt-1.5">歡迎回來！請輸入管理權限帳號或與會者帳號</p> -->
            </div>
            <!-- Login Form -->
            <form class="flex flex-col gap-5" id="login-form" @submit.prevent="goSubmit">
            <!-- 1. Account / Email Field -->
            <div class="flex flex-col gap-2">
                <label class="font-body-md text-body-md font-semibold text-on-surface flex items-center justify-between"
                for="account">
                <span>帳號</span>
                <!-- <span class="font-label-mono text-label-mono text-xs text-on-surface-variant font-normal">必填</span> -->
                </label>
                <div class="relative flex items-center">
                <span
                    class="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">mail</span>
                <input 
                v-model="account"
                v-bind="accountProps"
                autocomplete="account"
                    class="w-full pl-10 pr-4 py-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/25 transition-all"
                    id="account" name="account" placeholder="請輸入帳號" required="" type="text" />
                </div>
                <p v-if="errors.account" class="w-full text-red-500">{{ errors.account }}</p>
            </div>
            <!-- 2. Password Field with Toggle -->
            <div class="flex flex-col gap-2">
                <div class="flex items-center justify-between">
                <label class="font-body-md text-body-md font-semibold text-on-surface" for="password">密碼</label>
                <!-- <a class="font-label-mono text-label-mono text-xs text-secondary hover:text-on-secondary-fixed-variant transition-colors"
                    href="#">忘記密碼？</a> -->
                </div>
                <div class="relative flex items-center">
                    <span
                        class="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">lock</span>
                    <input 
                    v-model="password"
                    v-bind="passwordProps"
                    autocomplete="current-password"
                        class="w-full pl-10 pr-12 py-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/25 transition-all" placeholder="請輸入密碼" required="" :type="passwordInputType" />
                    <button
                    @click="togglePasswordVisible"
                    :title="isPasswordVisible ? '隱藏密碼' : '顯示密碼'"
                        aria-label="切換密碼可見狀態"
                        class="absolute right-2 p-2 rounded-lg text-outline hover:text-on-surface transition-colors flex items-center justify-center focus:outline-none"
                        ref="toggle-password-btn" type="button">
                        <span class="material-symbols-outlined text-[20px]" ref="toggle-icon" >{{ isPasswordVisible ? 'visibility' : 'visibility_off' }}</span>
                    </button>
                </div>
                <p v-if="errors.password" class="w-full text-red-500">{{ errors.password }}</p>
            </div>
            <!-- 3. Primary Submit Button -->
            <button type="submit"
            class="w-full mt-2 py-3.5 px-6 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-body-md text-body-md font-semibold tracking-wide flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all">
                <span>登入</span>
                <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
            <!-- <div v-if="isLoggedIn" class="text-red-500">{{ isLoggedIn ? '登入成功' : '登入失敗'}}</div> -->
            <p v-if="loginError" class="text-red-500">{{ loginError }}</p>
            


            <!-- 4. Terms and Conditions Disclaimer -->
            <!-- <p class="font-label-mono text-label-mono text-xs text-on-surface-variant text-center leading-relaxed mt-1">
                登入即表示您同意
                <a class="text-secondary underline underline-offset-2 hover:text-on-secondary-fixed-variant transition-colors"
                href="#">《服務規約》</a>
                與
                <a class="text-secondary underline underline-offset-2 hover:text-on-secondary-fixed-variant transition-colors"
                href="#">《隱私權政策》</a>
            </p> -->
            </form>


            <!-- 5. Third-party Fast Login Divider -->
            <!-- <div class="relative flex items-center justify-center my-6">
            <div class="w-full h-px bg-surface-container-high"></div>
            <span
                class="absolute bg-surface-container-lowest px-3 font-label-mono text-label-mono text-xs text-on-surface-variant">或使用以下方式快速登入</span>
            </div> -->
            <!-- Google Login Button -->
            <!-- <button
            class="w-full py-3 px-4 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low text-on-surface font-body-md text-body-md font-medium flex items-center justify-center gap-3 transition-colors shadow-sm"
            type="button">
            <svg class="w-5 h-5 shrink-0" viewbox="0 0 24 24">
                <path
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                fill="#4285F4"></path>
                <path
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                fill="#34A853"></path>
                <path
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                fill="#FBBC05"></path>
                <path
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                fill="#EA4335"></path>
            </svg>
            <span>使用 Google 帳號登入</span>
            </button> -->
            <!-- 6. Registration Guidance Link -->
            <div
            class="mt-8 pt-6 bg-surface-container-low -mx-8 sm:-mx-10 -mb-8 sm:-mb-10 px-8 py-5 flex items-center justify-center gap-2">
            <span class="font-body-md text-body-md text-on-surface-variant">還沒有帳號？</span>

            <RouterLink to="/step01">
                <div class="font-body-md text-body-md font-semibold text-secondary hover:text-on-secondary-fixed-variant inline-flex items-center gap-1 transition-colors"
                data-path="seminar-overview" >
                    <span>立即報名研討會</span>
                    <span class="material-symbols-outlined text-[16px]">chevron_right</span>
                </div>
            </RouterLink>
            
            </div>
            </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <Footer />
</template>