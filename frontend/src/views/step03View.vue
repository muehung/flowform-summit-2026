<script setup>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { ErrorMessage, useForm, defineRule } from 'vee-validate'
import Navbar from './../Components/NavbarComponent.vue'
import Footer from './../Components/FooterComponent.vue'
import StepProgress from '../components/StepProgressComponent.vue';
import { stepNumbers } from '../data/stepProgress.js'
import { useFormStore } from '../stores/useFormStore.js';

const storeForm = useFormStore();

const { form, inputFirstFocus } = storeToRefs(storeForm);
const { submitGoNext } = storeForm;

onMounted(()=>{
    inputFirstFocus.value.focus();
})

// confirmedPw
// defineRule('confirmedPw',)


// 第一階段（同步檢查）：如果 val 是空的，直接回傳錯誤訊息 "請輸入帳號"。
// 第二階段（非同步檢查）：呼叫 await checkAccountApi(val)，如果回傳 false（表示帳號已被佔用），就回傳 "該帳號已被使用，請更換"；否則回傳 true。
const checkAccountApi = async function(val){
    const url = "http://localhost:3000/api/check-account";
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ account: val })
        });
        const data = await res.json();
        if(!res.ok){ return false }
        return data.available
    } catch(err) {
        console.error(err.message)
        return false
    }
};

// 用來驗證
const schemaForm = {
async account(val){
    if( !val || val?.trim() === "") { return "請填寫帳號" }
    if ( await checkAccountApi(val) === false) { return "已經有重複帳號" }
    return true
},
password(val){
    if( !val || val?.trim() === "") {
        return "請填寫密碼"
    } else if("密碼的驗證最短最長、中英文、有英文大小寫") {
        return "密碼需要有最短最長、中英文、有英文大小寫"
    } else {
        return true
    }
},
passwordConfirm(val){
    if( !val || val?.trim() === "") {
        return "密碼不一致"
    } else if("比對"){
        return "密碼不一致"
    } else {
        return true
    }
}
}

// vee-validate
const { values, errors, defineField, handleSubmit } = useForm({
    validationSchema: schemaForm,
    initialValues: form.value,
    validateOnBlur: false,
    validateOnModelUpdate: false,
});

// UI value
const [ account, accountProps ] = defineField('account');
const [ password, passwordProps ] = defineField('password');
const [ passwordConfirm, passwordConfirmProps ] = defineField('passwordConfirm');

// 流程 UI
const stepProgress = stepNumbers.find((step)=> step.number === 3);

const router = useRouter();

// 上一步 button
function goPrevious(){
    router.push({ path: '/step02' })
}
// 下一步 submit
// vee-validate's handleSubmit
const goSubmit = handleSubmit(
    (ok) => {
        console.log('✅ 驗證通過:', ok);
        form.value = {
            ...form.value,
            account: account.value,
            password: password.value,
            passwordConfirm: passwordConfirm.value,
        }
        submitGoNext(4)
    },
    (ctx) => {
        console.log('❌ 驗證失敗:', ctx.errors)
        console.log(ErrorMessage)
    }
)

</script>
<template>
    <!-- Top Navigation Accent -->
    <div class="h-2 w-full gradient-accent"></div>

    <!-- navbar -->
    <Navbar />

    <main class="max-w-[800px] mx-auto px-margin-mobile md:px-gutter py-stack-lg min-h-[calc(100vh-128px)]">
        
        <!-- step progress -->
        <StepProgress :currentStep="3"/>
        
        <!-- Registration Form Container -->
        <div class="max-w-[600px] mx-auto glass-card p-gutter md:p-stack-lg rounded-xl shadow-sm">
            <header class="mb-stack-md text-center">
                <h2 class="font-headline-lg text-headline-lg text-primary mb-2">設定您的登入帳號</h2>
                <p class="font-body-md text-body-md text-on-surface-variant">請設定一組用於管理您的研討會參與和證書下載的帳號密碼。</p>
            </header>
            <form class="space-y-stack-md" @submit.prevent="goSubmit">
                <!-- Username Field with Loading State -->
                <div class="space-y-stack-sm">
                    <label class="block font-body-md text-body-md font-bold text-primary" for="username">使用者名稱</label>
                    <div class="relative group">
                        <input
                            v-model="account"
                            v-bind="accountProps"
                            ref="inputFirstFocus"
                            class="w-full bg-surface border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all rounded-lg h-12 px-4 font-body-md"
                            id="username" placeholder="請輸入欲使用的帳號" type="text" />
                        <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <div
                                class="animate-spin h-4 w-4 border-2 border-secondary border-t-transparent rounded-full">
                            </div>
                        </div>
                    </div>
                    <p class="font-label-mono text-label-mono text-secondary flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[16px]">sync</span>
                        <span class="loading-dots">檢查帳號是否可用中</span>
                    </p>
                </div>
                <!-- Password Field -->
                <div class="space-y-stack-sm">
                    <label class="block font-body-md text-body-md font-bold text-primary" for="password">密碼</label>
                    <div class="relative group">
                        <input
                        v-model="password"
                        v-bind="passwordProps"
                            class="w-full bg-surface border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all rounded-lg h-12 px-4 font-body-md"
                            id="password" placeholder="至少 8 個字元，含英文字母及數字" type="password" />
                        <button class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant" type="button">
                            <span class="material-symbols-outlined">visibility_off</span>
                        </button>
                    </div>
                    <div class="flex gap-1 mt-2">
                        <div class="h-1.5 flex-1 rounded-full bg-surface-container-high"></div>
                        <div class="h-1.5 flex-1 rounded-full bg-surface-container-high"></div>
                        <div class="h-1.5 flex-1 rounded-full bg-surface-container-high"></div>
                        <div class="h-1.5 flex-1 rounded-full bg-surface-container-high"></div>
                    </div>
                    <p class="font-label-sm text-label-mono text-on-surface-variant">建議包含特殊符號以增強安全性</p>
                </div>
                <!-- Confirm Password Field -->
                <div class="space-y-stack-sm">
                    <label class="block font-body-md text-body-md font-bold text-primary"
                        for="confirm_password">再次確認密碼</label>
                    <input
                        v-model="passwordConfirm"
                        v-bind="passwordConfirmProps"
                        class="w-full bg-surface border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all rounded-lg h-12 px-4 font-body-md"
                        id="confirm_password" placeholder="請再次輸入密碼" type="password" />
                </div>
                <!-- Document Text Section (Placeholder for DOCUMENT_6 context) -->
                <div class="p-4 bg-surface-container-low rounded-lg border border-outline-variant/30 mt-stack-lg">
                    <div class="flex items-start gap-3">
                        <span class="material-symbols-outlined text-primary-fixed-dim shrink-0">info</span>
                        <div>
                            <p class="font-label-mono text-label-mono text-on-surface-variant leading-relaxed">
                                根據 FlowForm IT Seminar 隱私權保護條款，您的帳號資訊將受到工業級加密保護。請務必牢記您的密碼，系統管理員無法查看您的原始密碼。
                            </p>
                        </div>
                    </div>
                </div>
                <!-- Form Actions -->
                <div class="flex flex-col sm:flex-row items-center gap-stack-sm pt-stack-md">
                    <button
                    @click="goPrevious"
                        class="w-full sm:w-1/3 h-14 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary-container hover:text-on-primary transition-all active:scale-95"
                        type="button">
                        上一步
                    </button>
                    <button
                        class="w-full sm:w-2/3 h-14 bg-primary text-on-primary font-bold rounded-lg shadow-md hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2"
                        type="submit">
                        下一步：確認送出
                        <span class="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </form>
        </div>
        <!-- Identity Markers (Capsule Tags) -->
        <div class="mt-stack-lg flex flex-wrap justify-center gap-2">
            <span class="bg-tag-bg px-4 py-1.5 rounded-full font-label-mono text-label-mono text-on-surface-variant">IT
                Professional</span>
            <span
                class="bg-tag-bg px-4 py-1.5 rounded-full font-label-mono text-label-mono text-on-surface-variant">DevOps
                Engineer</span>
            <span
                class="bg-tag-bg px-4 py-1.5 rounded-full font-label-mono text-label-mono text-on-surface-variant">Cloud
                Solutions</span>
            <span
                class="bg-tag-bg px-4 py-1.5 rounded-full font-label-mono text-label-mono text-on-surface-variant">Student
                Advocate</span>
        </div>
    </main>
    <!-- Top Navigation Accent -->


    <!-- Footer -->
    <Footer />
</template>