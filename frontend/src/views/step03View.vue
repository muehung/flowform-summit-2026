<script setup>
import { onMounted, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { ErrorMessage, useForm } from 'vee-validate';
import Navbar from './../Components/NavbarComponent.vue';
import Footer from './../Components/FooterComponent.vue';
import StepProgress from '../components/StepProgressComponent.vue';
import { stepNumbers } from '../data/stepProgress.js';
import { useFormStore } from '../stores/useFormStore.js';

const storeForm = useFormStore();
const { form, inputFirstFocus } = storeToRefs(storeForm);
const { submitGoNext } = storeForm;

// 驗證
const schemaForm = {
    async account(val){
        if( !val || val?.trim() === "") { return "請填寫帳號" }
        if( val.length < 4 ) { return "請輸入超過 3 字元" }
        // if ( await handleAccountApi(val) === false) { return "已經有重複帳號" }
        return true
    },
    password(val){
        if( !val || val?.trim() === "") {
            return "請填寫密碼"
        }
        if (val.length < 8 || val.length > 20 ) {
            return "密碼長度需在 8 到 20 個字元之間";
        }

        const hasUpper = /[A-Z]/.test(val);
        const hasLower = /[a-z]/.test(val);
        const hasNumber = /\d/.test(val); // 檢查至少有一個數字
        if(!hasUpper || !hasLower || !hasNumber){
            return "密碼需同時包含英文大寫、小寫與數字";
        }

        return true
    },
    passwordConfirm(val){
        if( !val || val?.trim() === "") {
            return "請再次輸入密碼";
        } else if(val !== values.password ){
            return "密碼不一致，請重新輸入"
        } else {
            return true
        }
    }
}

// vee-validate: values & errors，已經從 initialValues 綁定
const { values, errors, defineField, handleSubmit, validateField } = useForm({
    validationSchema: schemaForm,
    initialValues: form.value,
});

// UI connected
const [ account, accountProps ] = defineField('account', {
    validateOnBlur: false, // 防止欄位在剛進頁面時誤觸發空白警告
    validateOnModelUpdate: false, // v-model 每次更新 account，不自動驗證
    // validateOnInput: false, // 避免每輸入一個字就驗證, 預設 false
    // validateOnChange: false, // 修改後離開 input，可能 change，造成另一條驗證
    
    props: ()=> ({ onBlur: validateCheckAccount }) // 第2個()是指，要回傳內部物件，等同return
});
const [ password, passwordProps ] = defineField('password');
const [ passwordConfirm, passwordConfirmProps ] = defineField('passwordConfirm');

// account api
const handleAccountApi = async function(y){
    const url = "http://localhost:3000/api/check-account";
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ account: y }),
        });
        if(res.status === 404 ) { throw new Error("404 錯誤") }
        if(res.status === 500 ) { throw new Error("500 錯誤") }
        if(!res.ok){ throw new Error(res.status + "error") }
        const data = await res.json(); // 相當於 JSON.parse
        
        return data.available
    } catch(err) {
        // console.error(err.message)
        throw new Error(err)
    }
};

const accountStatus = ref("idle");
// 5種狀態：idle checking available unavailable failed

const validateCheckAccount = async ()=>{
    // vee-validate's
    // 整份表單共用，呼叫執行驗證
    const { valid } = await validateField('account');
    if(valid === false) return;

    accountStatus.value = "checking";
    try {
        const isAvailable = await handleAccountApi(account.value)
        accountStatus.value = isAvailable
        ? "available"
        : "unavailable"
    } catch(error) {
        accountStatus.value = "failed";
    }
}

const accountUi = {
    idle: {
        message: '',
        className: '',
    },
    checking: {
        message: '帳號檢查中',
        className: 'text-secondary',
    },

    available: {
        message: '帳號可以使用',
        className: 'text-lime-500',
    },

    unavailable: {
        message: '帳號已被使用',
        className: 'text-red-500',
    },

    failed: {
        message: '檢查失敗，請稍後再試',
        className: 'text-yellow-500',
    },
};

const accountCheckUi = computed(()=>{
     return accountUi[accountStatus.value]
})

// UI Password
const showpassword = ref(false);


// passwordConfirm
const showPasswordConfirm = ref(false);
// const passwordConfirm

// 流程 UI
const stepProgress = stepNumbers.find((step)=> step.number === 3);

onMounted(()=>{
    inputFirstFocus.value.focus();
})

const router = useRouter();
// 上一步 button
function goPrevious(){
    router.push({ path: '/step02' })
}
// 下一步 submit
// vee-validate's handleSubmit
const goSubmit = handleSubmit(
    (submittedValues) => {
        // console.log('驗證通過:', submittedValues);

        const step03Values = {
            account: account.value,
            password: password.value,
        }
        
        form.value.account = step03Values.account;
        form.value.password = step03Values.password;
        
        submitGoNext(4)
    },
    (ctx) => {
        console.log('驗證失敗:', ctx.errors)
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
                        <input data-private
                            v-model="account"
                            v-bind="accountProps"
                            @input="accountStatus = 'idle'"
                            ref="inputFirstFocus"
                            class="w-full bg-surface border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/80 transition-all rounded-lg h-12 px-4 font-body-md"
                            id="username" placeholder="請輸入欲使用的帳號" 
                            autocomplete="username" type="text" />
                        <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">

                            <div v-if="
                            accountStatus === 'unavailable' ||
                            accountStatus === 'failed'">
                                <!-- 叉叉 -->
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#da0000" width="24px" height="24px" viewBox="0 0 24 24" stroke-width="2" stroke="red" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div v-if="accountStatus === 'available'">
                                <!-- 打勾 -->
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="24px" height="24px" viewBox="0 0 24 24" stroke-width="2" stroke="#84cc16" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                            </div>
                            <div v-if="accountStatus === 'checking'">
                                <!-- 轉圈 -->
                                <div class="animate-spin h-4 w-4 border-2 border-secondary border-t-transparent rounded-full"></div>
                            </div>
                            
                        </div>
                    </div>
                    
                    <!-- local input validate -->
                    <p v-if="errors.account"
                    class="font-label-mono text-label-mono flex items-center gap-1.5 text-secondary/80">
                        {{ errors.account }}
                    </p>
                    <!-- api validate -->
                    <p v-else-if="accountCheckUi.message"
                    :class="accountCheckUi.className"
                    class="font-label-mono text-label-mono flex items-center gap-1.5">
                            <span class="loading-dots">{{ accountCheckUi.message }}</span>
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
                            id="password" placeholder="至少 8 個字元，含大小寫英文字母及1數字" :type="showpassword ? 'text' : 'password'" 
                            autocomplete="new-password" />
                        <button
                        @click="showpassword = !showpassword"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant" type="button">
                        <span v-if="showpassword ? false : true">
                            <span class="material-symbols-outlined">visibility_off</span>
                        </span>
                        <span v-else>
                            <span class="material-symbols-outlined">visibility</span>
                        </span>
                        
                        </button>
                    </div>
                    <!-- 中強度表 -->
                    <!-- <div class="flex gap-1 mt-2">
                        <div class="h-1.5 flex-1 rounded-full bg-surface-container-high"></div>
                        <div class="h-1.5 flex-1 rounded-full bg-surface-container-high"></div>
                        <div class="h-1.5 flex-1 rounded-full bg-surface-container-high"></div>
                        <div class="h-1.5 flex-1 rounded-full bg-surface-container-high"></div>
                    </div> -->
                    <p class="font-label-sm text-label-mono text-on-surface-variant">{{ errors.password }}</p>
                </div>
                <!-- Confirm Password Field -->
                <div class="space-y-stack-sm">
                    <label class="block font-body-md text-body-md font-bold text-primary"
                        for="confirm_password">再次確認密碼</label>
                    <div class="relative group">
                        <input
                            v-model="passwordConfirm"
                            v-bind="passwordConfirmProps"
                            class="w-full bg-surface border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all rounded-lg h-12 px-4 font-body-md"
                            id="confirm_password" placeholder="請再次輸入密碼" :type="showPasswordConfirm ? 'text' : 'password'" />

                        <button
                        @click="showPasswordConfirm = !showPasswordConfirm"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant" type="button">
                            <span v-if="showPasswordConfirm ? false : true">
                                <span class="material-symbols-outlined">visibility_off</span>
                            </span>
                            <span v-else>
                                <span class="material-symbols-outlined">visibility</span>
                            </span>
                        </button>
                    </div>
                        <p 
                        class="font-label-mono text-label-mono flex items-center gap-1.5 text-secondary/80">
                            {{ errors.passwordConfirm }}
                        </p>
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