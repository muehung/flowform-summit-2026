<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import Navbar from '../components/NavbarComponent.vue'
import Footer from '../components/FooterComponent.vue'
import StepProgress from '../components/StepProgressComponent.vue';

const form = ref({
    name: '',
    email: '',
    phone: '',
    identity: '',
})

const errors = ref({
    name: '',
    email: '',
    phone: '',
    identity: '',
})

const inputFirstFocus = ref(null);
onMounted(()=>{
    inputFirstFocus.value.focus();
})

function validateForm() {
    if(form.value.name === "") {
        errors.value.name = "請填寫姓名欄位";
    } else {
        errors.value.name = "";
    }

    if(form.value.email === "" || !form.value.email.includes("@")) {
        errors.value.email = "請填寫email欄位或格式錯誤";
    } else {
        errors.value.email = "";
    }

    const phoneRegex = /^09\d{2}\d{3}\d{3}$/;
    if(form.value.phone === "" || !phoneRegex.test(form.value.phone)) {
        errors.value.phone = "請填寫正確手機格式欄位";
    } else {
        errors.value.phone = "";
    }

    if(form.value.identity === "") {
        errors.value.identity = "請選擇身份";
    } else {
        errors.value.identity = "";
    }

    // errors obj的值 變成 array value
    const formValue = Object.values(errors.value);
    // .every 用的工具
    const isFalse = (currentValue)=> currentValue === "" || currentValue == false; 
    return formValue.every(isFalse);

    // return Object.values(errors.value).every(msg => msg === "" || msg == false)
}


const router = useRouter();
function submitGoNext() {
    if(validateForm()){
        console.log('Moving to step 2...');
        router.push({ path: '/step02' })
    }
}

function cancelRegistration() {
    form.value = {
        name: '',
        email: '',
        phone: '',
        identity: '',
    };
    errors.value = {
        name: '',
        email: '',
        phone: '',
        identity: '',
    }
}


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
                <form class="space-y-stack-md" @submit.prevent="submitGoNext">
                    <!-- Name Field -->
                    <div class="space-y-stack-sm">
                        <label class="block font-body-md font-bold text-on-surface" for="name">真實姓名</label>
                        <input
                            :value="form.name"
                            @input="form.name = $event.target.value"
                            ref="inputFirstFocus"
                            class="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-200 outline-none"
                            id="name" name="name" placeholder="請輸入完整姓名" type="text" />
                            <span v-if="errors.name" class="text-red-500">{{errors.name}}</span>
                    </div>
                    <!-- Email Field -->
                    <div class="space-y-stack-sm">
                        <label class="block font-body-md font-bold text-on-surface" for="email">電子郵件 </label>
                        <input
                            :value="form.email"
                            @input="form.email = $event.target.value"
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
                        <label class="block font-body-md font-bold text-on-surface" for="phone">聯絡電話 </label>
                        <input
                            :value="form.phone"
                            @input="form.phone = $event.target.value"
                            class="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-200 outline-none"
                            id="phone" name="phone" placeholder="09XX-XXX-XXX" type="tel" />
                            <span v-if="errors.phone" class="text-red-500">{{errors.phone}}</span>
                    </div>
                    <!-- Identity Field -->
                    <div class="space-y-stack-sm">
                        <label class="block font-body-md font-bold text-on-surface" for="identity">身分類別 </label>
                        <div class="relative">
                            <select
                                :value="form.identity" @change="form.identity = $event.target.value"
                                class="w-full h-12 px-4 pr-10 rounded-lg border border-outline-variant bg-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-200 outline-none appearance-none cursor-pointer"
                                id="identity" name="identity">
                                <option disabled="" selected="" value="">請選擇您的身分</option>
                                <option value="developer">軟體開發者 (Developer)</option>
                                <option value="devops">維運工程師 (DevOps)</option>
                                <option value="student">在學學生 (Student)</option>
                                <option value="manager">技術經理 (Manager)</option>
                                <option value="other">其他 (Other)</option>
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