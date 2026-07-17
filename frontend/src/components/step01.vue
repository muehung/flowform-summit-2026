<script setup>
import { ref } from 'vue'

const form = ref({
    name: '',
    email: '',
    phone: '',
    identity: '',
})

const heroAlt = 'A vibrant, high-energy digital art piece featuring a chaotic yet beautiful mix of colorful fluid gradients and geometric shapes. The style is inspired by modern IT seminars, showcasing deep magentas, indigo blues, and bright teals in a multi-chromatic swirl.'

function submitForm() {
    console.log('Moving to step 2...', form.value)
}

function cancelRegistration() {
    form.value = {
        name: '',
        email: '',
        phone: '',
        identity: '',
    }
}
</script>
<template>
    <div class="bg-surface shadow-sm sticky top-0 z-50">
        <div class="max-w-container-max mx-auto px-margin-mobile md:px-0">
            <div class="bg-background text-on-surface font-body-md selection:bg-secondary-container">
                <!-- Top Navigation Accent -->
                <div class="h-2 w-full gradient-accent"></div>
                <!-- TopAppBar -->
                <header class="bg-surface shadow-sm sticky top-0 z-50">
                    <div class="flex justify-between items-center w-full px-gutter h-16 max-w-container-max mx-auto">
                        <div class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-primary text-3xl" style="font-variation-settings: 'FILL' 1;">bubble_chart</span>
                            <h1 class="font-headline-md text-headline-md font-black text-primary tracking-tight">FlowForm</h1>
                        </div>
                        <div class="flex items-center gap-4">
                            <button class="material-symbols-outlined text-on-surface-variant hover:text-secondary transition-colors text-2xl">account_circle</button>
                        </div>
                    </div>
                </header>
                <main class="min-h-screen pt-stack-lg pb-stack-lg">
                    <div class="max-w-container-max mx-auto px-margin-mobile md:px-0">
                        <!-- Progress Tracker -->
                        <div class="mb-stack-lg">
                            <div class="flex items-center justify-between relative mb-2">
                                <!-- Progress Line Background -->
                                <div class="absolute top-1/2 left-0 w-full h-[2px] bg-surface-container-high -translate-y-1/2 z-0"></div>
                                <!-- Progress Line Active (Step 1 is 0%) -->
                                <div class="absolute top-1/2 left-0 w-0 h-[2px] gradient-accent -translate-y-1/2 z-0 transition-all duration-500"></div>
                                <!-- Steps -->
                                <div class="z-10 flex flex-col items-center">
                                    <div class="w-10 h-10 rounded-full gradient-accent flex items-center justify-center text-white font-bold ring-4 ring-background pulse-secondary">1</div>
                                    <span class="font-label-sm text-label-sm mt-2 text-primary font-bold">填寫基本資料</span>
                                </div>
                                <div class="z-10 flex flex-col items-center">
                                    <div class="w-10 h-10 rounded-full bg-surface-container-highest border-2 border-outline-variant flex items-center justify-center text-on-surface-variant font-bold ring-4 ring-background">2</div>
                                    <span class="font-label-sm text-label-sm mt-2 text-on-surface-variant hidden md:block">選擇場次</span>
                                </div>
                                <div class="z-10 flex flex-col items-center">
                                    <div class="w-10 h-10 rounded-full bg-surface-container-highest border-2 border-outline-variant flex items-center justify-center text-on-surface-variant font-bold ring-4 ring-background">3</div>
                                    <span class="font-label-sm text-label-sm mt-2 text-on-surface-variant hidden md:block">確認訂單</span>
                                </div>
                                <div class="z-10 flex flex-col items-center">
                                    <div class="w-10 h-10 rounded-full bg-surface-container-highest border-2 border-outline-variant flex items-center justify-center text-on-surface-variant font-bold ring-4 ring-background">4</div>
                                    <span class="font-label-sm text-label-sm mt-2 text-on-surface-variant hidden md:block">完成報名</span>
                                </div>
                            </div>
                        </div>
                        <!-- Hero/Header Visual -->
                        <div class="mb-stack-lg rounded-xl overflow-hidden relative h-48 md:h-64 shadow-lg group">
                            <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" :alt="heroAlt" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiQPpzMGSxdzScOJuzsfUGwpIBysPCgE8vq-fMo8pXxtHPiVdCGEgOMXy56F33Lc9k9sicWN6i4SZ3Cm-yzVos0H1lHlS43ufLYmipM3sJN0Euj9_NgYhkI6AlRUtSNTLQ8RAEQyYv8AC2-3ebxH7xy1HxCulwDUyVFceUVBSIpGEHBeeOgZoePsBQW9qIhGRB7sQJr4CJz8QzhqPKkuGx2Gi-n_nv7stZTyfJ7B7bAceGdYSvkQXCzj6PnSDTh3z8Z8kuFOpE-_8" />
                            <div class="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
                            <div class="absolute bottom-6 left-6">
                                <h2 class="font-headline-lg text-headline-lg text-white mb-1">Step 1: 填寫基本資料</h2>
                                <p class="font-body-md text-white/80 max-w-md">歡迎參加年度 IT 技術研討會，請提供您的聯絡資訊以協助我們為您準備專屬席位。</p>
                            </div>
                        </div>
                        <!-- Registration Form Card -->
                        <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-10 shadow-sm transition-all-custom">
                            <form class="space-y-stack-md" @submit.prevent="submitForm">
                                <!-- Name Field -->
                                <div class="space-y-stack-sm">
                                    <label class="block font-body-md font-bold text-on-surface" for="name">真實姓名</label>
                                    <input v-model="form.name" class="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-200 outline-none" id="name" name="name" placeholder="請輸入完整姓名" type="text" />
                                </div>
                                <!-- Email Field -->
                                <div class="space-y-stack-sm">
                                    <label class="block font-body-md font-bold text-on-surface" for="email">電子郵件</label>
                                    <input v-model="form.email" class="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-200 outline-none" id="email" name="email" placeholder="example@itseminar.com" type="email" />
                                    <p class="font-label-mono text-label-mono text-on-surface-variant flex items-center gap-1">
                                        <span class="material-symbols-outlined text-[16px]">info</span>
                                        我們將寄送電子票券至此信箱，請務必填寫正確。
                                    </p>
                                </div>
                                <!-- Phone Field -->
                                <div class="space-y-stack-sm">
                                    <label class="block font-body-md font-bold text-on-surface" for="phone">聯絡電話</label>
                                    <input v-model="form.phone" class="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-200 outline-none" id="phone" name="phone" placeholder="09XX-XXX-XXX" type="tel" />
                                </div>
                                <!-- Identity Field -->
                                <div class="space-y-stack-sm">
                                    <label class="block font-body-md font-bold text-on-surface" for="identity">身分類別</label>
                                    <div class="relative">
                                        <select v-model="form.identity" class="w-full h-12 px-4 pr-10 rounded-lg border border-outline-variant bg-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-200 outline-none appearance-none cursor-pointer" id="identity" name="identity">
                                            <option disabled value="">請選擇您的身分</option>
                                            <option value="developer">軟體開發者 (Developer)</option>
                                            <option value="devops">維運工程師 (DevOps)</option>
                                            <option value="student">在學學生 (Student)</option>
                                            <option value="manager">技術經理 (Manager)</option>
                                            <option value="other">其他 (Other)</option>
                                        </select>
                                        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">keyboard_arrow_down</span>
                                    </div>
                                </div>
                                <!-- Form Action Buttons -->
                                <div class="pt-stack-md flex flex-col-reverse md:flex-row gap-4 justify-between items-center">
                                    <button class="w-full md:w-auto px-8 py-3 rounded-lg border border-primary text-primary font-bold hover:bg-surface-container-high transition-all-custom flex items-center justify-center gap-2" type="button" @click="cancelRegistration">
                                        取消報名
                                    </button>
                                    <button class="w-full md:w-48 px-8 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-container hover:shadow-lg transition-all-custom flex items-center justify-center gap-2 group" type="submit">
                                        下一步
                                        <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
                <!-- Footer -->
                <footer class="bg-surface-container-low border-t border-outline-variant mt-stack-lg">
                    <div class="flex flex-col md:flex-row justify-between items-center w-full px-gutter max-w-container-max mx-auto py-10 gap-stack-sm">
                        <div class="flex flex-col items-center md:items-start gap-2">
                            <div class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary text-2xl">bubble_chart</span>
                                <span class="font-headline-md text-headline-md text-primary font-black tracking-tight">FlowForm</span>
                            </div>
                            <p class="font-label-mono text-label-mono text-on-surface-variant">© 2024 FlowForm IT Seminar. All rights reserved.</p>
                        </div>
                        <div class="flex gap-6">
                            <a class="font-label-mono text-label-mono text-on-surface-variant hover:text-secondary transition-colors" href="#">Privacy Policy</a>
                            <a class="font-label-mono text-label-mono text-on-surface-variant hover:text-secondary transition-colors" href="#">Terms of Service</a>
                            <a class="font-label-mono text-label-mono text-on-surface-variant hover:text-secondary transition-colors" href="#">Support</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    </div>
    
</template>

<style scoped>
.gradient-accent {
    background: linear-gradient(90deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%);
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
        opacity: .7;
        transform: scale(1.1);
    }
}
</style>
