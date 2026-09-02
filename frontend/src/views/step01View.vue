<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { ErrorMessage, useForm } from 'vee-validate';
import Navbar from '../components/NavbarComponent.vue';
import Footer from '../components/FooterComponent.vue';
import StepProgress from '../components/StepProgressComponent.vue';
// import { stepNumbers } from '../data/stepProgress.js' // step02 以後才用到
import { useFormStore } from '../stores/useFormStore.js';


const storeForm = useFormStore();
const { form, inputFirstFocus } = storeToRefs(storeForm);
const { submitGoNext, cancelRegistration } = storeForm;


onMounted(()=>{
    inputFirstFocus.value.focus();
})

const schemaForm = {
nameX(val) {
    if ( !val || val?.trim() === "" ) {
    return "請填寫姓名欄位"
    } else if ( val.length > 8 ) {
    return "超過 8 個字元"
    } else {
    return true
    }
},
email(val) {
    if( !val || val?.trim() === "") {
    return "請填寫EMAIL"
    } else if ( !val.includes("@")){
    return "請填寫EMAIL正確格式"
    } else {
    return true
    }
},
phone(val){
    const phoneRegex = /^09\d{2}\d{3}\d{3}$/;
        if( !val || val?.trim() === "" || !phoneRegex.test(val)) {
            return "請填寫正確手機格式欄位"
        } else {
            return true
        }    
},
identity(val){
    if(val === "") {
        return "請選擇身份"
    } else {
        return true
    }
}}

const { values, errors, defineField, handleSubmit } = useForm({
    validationSchema: schemaForm,
    initialValues: form.value,
    validateOnBlur: false,
    validateOnModelUpdate: false,
});
const [ nameX, nameXProps ] = defineField('nameX');
const [ email, emailProps ] = defineField('email');
const [ phone, phoneProps ] = defineField('phone');
const [ identity, identityProps ] = defineField('identity');



// vee-validate's handleSubmit
// 這裡面的程式碼,只有全部欄位驗證通過才會執行
const goSubmit = handleSubmit(
    (submittedValues) => {
        const step02Values = {
            nameX: submittedValues.nameX,
            email: submittedValues.email,
            phone: submittedValues.phone,
            identity: submittedValues.identity
        }

        // console.log('✅ 驗證通過:', submittedValues)
        form.value = {
            ...values,
            nameX: step02Values.nameX,
            email: step02Values.email,
            phone: step02Values.phone,
            identity: step02Values.identity
        }
        submitGoNext(2)
    },
    (ctx) => {
        // console.log('❌ 驗證失敗:', ctx.errors)
        // console.log(ErrorMessage)
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
        <StepProgress :currentStep="1"/>


            <!-- Hero/Header Visual -->
            <div class="mb-stack-lg rounded-xl overflow-hidden relative h-48 md:h-64 shadow-lg group">
                <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="填寫基本資料"
                    src="../assets/bn01.png" />
                <div class="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
                <div class="absolute bottom-6 left-6">
                    <h2 class="font-headline-lg text-headline-lg text-white mb-1">Step 1: 填寫基本資料</h2>
                    <p class="font-body-md text-white/80 max-w-md">歡迎參加年度 IT 技術研討會，請提供您的聯絡資訊以協助我們為您準備專屬席位。</p>
                </div>
            </div>
            <!-- Registration Form Card -->
            <div
                class="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-10 shadow-sm transition-all-custom">
                <form class="space-y-stack-md" @submit.prevent="goSubmit">
                    <!-- Name Field -->
                    <div class="space-y-stack-sm">
                        <label class="block font-body-md font-bold text-on-surface" for="name">姓名
                            <span class="text-red-500 ml-0.5" aria-hidden="true">*</span>
                            <span class="sr-only">必填</span> 
                            <span class="text-gray-300"> 'admin', 'test', 'flowform', 'user123' </span>
                        </label>
                        <input
                            v-model="nameX" v-bind="nameXProps"
                            ref="inputFirstFocus"
                            class="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-200 outline-none"
                            id="name" name="name" placeholder="請輸入完姓名" type="text" />
                             <span v-if="errors.nameX" class="text-red-500">{{errors.nameX}}</span>
                    </div>
                    <!-- Email Field -->
                    <div class="space-y-stack-sm">
                        <label class="block font-body-md font-bold text-on-surface" for="email">電子郵件 
                            <span class="text-red-500 ml-0.5" aria-hidden="true">*</span>
                            <span class="sr-only">必填</span>
                        </label>
                        <input
                            v-model="email" v-bind="emailProps"
                            class="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-200 outline-none"
                            id="email" name="email" placeholder="example@itseminar.com" type="email" />

                            <span v-if="errors.email" class="text-red-500">{{errors.email}}</span>
                        <p class="font-label-mono text-label-mono text-on-surface-variant flex items-center gap-1">
                            <span class="material-symbols-outlined text-[16px]">info</span>
                            我們將寄送電子票券至此信箱，請務必填寫正確。
                        </p>
                    </div>
                    <!-- Phone Field -->
                    <div class="space-y-stack-sm">
                        <label class="block font-body-md font-bold text-on-surface" for="phone">聯絡電話 
                            <span class="text-red-500 ml-0.5" aria-hidden="true">*</span>
                            <span class="sr-only">必填</span>
                        </label>
                        <input
                            v-model="phone" v-bind="phoneProps"
                            class="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-200 outline-none"
                            id="phone" name="phone" placeholder="09XX-XXX-XXX" type="tel" />
                            <span v-if="errors.phone" class="text-red-500">{{errors.phone}}</span>
                    </div>
                    <!-- Identity Field -->
                    <div class="space-y-stack-sm">
                        <label class="block font-body-md font-bold text-on-surface" for="identity">身分類別 
                            <span class="text-red-500 ml-0.5" aria-hidden="true">*</span>
                            <span class="sr-only">必填</span>
                        </label>
                        <div class="relative">
                            <select
                                v-model="identity" v-bind="identityProps"
                                class="w-full h-12 px-4 pr-10 rounded-lg border border-outline-variant bg-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-200 outline-none appearance-none cursor-pointer"
                                id="identity" name="identity" >
                                <option disabled="" selected="" value="">請選擇您的身分</option>
                                <option value="developer">軟體開發者 (Developer)</option>
                                <option value="devops">維運工程師 (DevOps)</option>
                                <option value="student">在學學生 (Student)</option>
                                <option value="manager">技術經理 (Manager)</option>
                                <option value="designer">設計師 (Designer)</option>
                                <option value="vip">貴賓 (VIP)</option>
                                <option value="designer">講者 (Speaker)</option>
                                <option value="public">民眾 (General Public)</option>
                            </select>
                            <span v-if="errors.identity" class="text-red-500">{{ errors.identity }}</span>
                            <span
                                class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">keyboard_arrow_down</span>
                        </div>
                    </div>
                    <!-- Form Action Buttons -->
                    <div class="pt-stack-md flex flex-col-reverse md:flex-row gap-4 justify-between items-center">
                        <button
                            @click="cancelRegistration"
                            class="w-full md:w-auto px-8 py-3 rounded-lg border border-primary text-primary font-bold hover:bg-surface-container-high transition-all-custom flex items-center justify-center gap-2"
                            type="button">
                            清除
                        </button>
                        <button class="w-full md:w-48 px-8 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-container hover:shadow-lg transition-all-custom flex items-center justify-center gap-2 group"
                            type="submit">
                            下一步
                            <span
                                class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                    </div>
                </form>
            </div>
        
    </main>
    <!-- Top Navigation Accent -->

    <!-- Footer -->
    <Footer />
</template>


<!-- <style scoped>
.gradient-accent {
    background: linear-gradient(90deg, #ff3cac 0%, #784ba0 50%, #2b86c5 100%);
}

.icon-filled {
    font-variation-settings: 'FILL' 1;
}

.form-glow:focus-within {
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.transition-all-custom {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.pulse-secondary {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.7;
        transform: scale(1.1);
    }
}
</style> -->