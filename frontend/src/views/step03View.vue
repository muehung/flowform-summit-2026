<script setup>
import { ref } from 'vue'
import Navbar from './../Components/NavbarComponent.vue'
import Footer from './../Components/FooterComponent.vue'

</script>
<template>
    <!-- body以下 -->
    <!-- Top Navigation Accent -->
    <div class="h-2 w-full gradient-accent"></div>

    <!-- navbar -->
    <Navbar />

    <main class="max-w-[800px] mx-auto px-margin-mobile md:px-gutter pt-stack-lg pb-24">
        <!-- Registration Hero Branding (Inspired by image) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-stack-md mb-stack-lg">
            <div
                class="relative group overflow-hidden rounded-xl h-48 md:h-64 shadow-sm transition-all hover:shadow-md">
                <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    data-alt="Abstract digital artwork for an IT seminar featuring energetic, multi-chromatic geometric shapes like circles, rectangles, and fluid lines. The color palette is vibrant with magenta, orange, and blue hues over a soft peach and lavender background, reflecting a creative 'Agentic AI' theme. The lighting is soft and ambient with a slight grainy texture, mimicking a modern generative art aesthetic."
                    style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAuFrkFN_QeRcuzJHz_uUYAlOkvwrfI9ZJEZ8exIJ57E61fSlz25WuMLLilU2C5aFRz-hN38nWfl7BWRctDA77_YVGUK7-u9cDkRfDuGCZ97iAwwo1JwZy6JU1PezGodZAlecB_sNYxxnxSexXOYSQ6yTSCJpPIUHyB-qDaNfx5v1HxTouMUhoNcWkxh7cFDNGSrpyj8CvG1d4RCjKRNAkeEZHzrwBbu9szesqYjLPVf7Hzwu3yh3pM9hEdHwvSqNUJ3j52rsa3UEg')">
                </div>
                <div class="absolute top-4 left-4">
                    <div
                        class="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-outline-variant shadow-sm">
                        <p class="font-label-mono text-label-mono text-primary">Agentic AI</p>
                    </div>
                </div>
            </div>
            <div
                class="relative group overflow-hidden rounded-xl h-48 md:h-64 shadow-sm transition-all hover:shadow-md">
                <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    data-alt="Vibrant generative digital art with fluid, swirling streams of neon colors including lime green, hot pink, and royal blue. The composition is dynamic and abstract, suggesting the complexity and power of Artificial Intelligence (AI). The overall aesthetic is sleek and high-energy, with smooth color transitions and a futuristic vibe that complements a professional IT event branding."
                    style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBGMHWIxSZpxq8idrv7CIfeAlEjpS01Mc7rErgtKI7eN-nxY64ojX4k4-PAAe9JW-4m-F7fMly_nfgAYZpglE5IzESKClmERRQMCd5ltM_wAkGbVnFCO-ku0lsqtxYTM30JO2euYlMvbD-IBl_ES0Vekcw6_4TH2ocA3PHfKAHE4beR6jHwlEfFWbaM-y5AbF5b7DcVaYJkRj3Cn7zvjSdGM-R-24QqrrsqhdXnGKxYH6MNoISY2o54IKBYXk_cWayPJ9dVRj7CH3I')">
                </div>
                <div class="absolute top-4 left-4">
                    <div
                        class="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-outline-variant shadow-sm">
                        <p class="font-label-mono text-label-mono text-primary">Artificial Intelligence (AI)</p>
                    </div>
                </div>
            </div>
        </div>
        <!-- Progress Bar -->
        <div class="mb-stack-lg max-w-xl mx-auto">
            <div class="flex items-center justify-between relative">
                <!-- Line background -->
                <div class="absolute top-1/2 left-0 w-full h-[2px] bg-surface-container-high -translate-y-1/2 z-0">
                </div>
                <!-- Progress fill -->
                <div
                    class="absolute top-1/2 left-0 w-1/2 h-[2px] bg-secondary -translate-y-1/2 z-0 transition-all duration-500">
                </div>
                <!-- Step 1 -->
                <div class="relative z-10 flex flex-col items-center gap-2">
                    <div
                        class="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-sm shadow-sm">
                        <span class="material-symbols-outlined text-[18px]">check</span>
                    </div>
                    <span class="hidden md:block font-label-sm text-label-sm text-on-surface-variant">基本資料</span>
                </div>
                <!-- Step 2 -->
                <div class="relative z-10 flex flex-col items-center gap-2">
                    <div
                        class="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-sm shadow-sm">
                        <span class="material-symbols-outlined text-[18px]">check</span>
                    </div>
                    <span class="hidden md:block font-label-sm text-label-sm text-on-surface-variant">研討會選擇</span>
                </div>
                <!-- Step 3 (Active) -->
                <div class="relative z-10 flex flex-col items-center gap-2">
                    <div
                        class="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-lg shadow-lg ring-4 ring-secondary/20 pulse-secondary">
                        3
                    </div>
                    <span class="font-label-sm text-label-sm text-primary font-bold">設定帳號</span>
                </div>
                <!-- Step 4 -->
                <div class="relative z-10 flex flex-col items-center gap-2">
                    <div
                        class="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold text-sm">
                        4
                    </div>
                    <span class="hidden md:block font-label-sm text-label-sm text-on-surface-variant">確認送出</span>
                </div>
            </div>
        </div>
        <!-- Registration Form Container -->
        <div class="max-w-[600px] mx-auto glass-card p-gutter md:p-stack-lg rounded-xl shadow-sm">
            <header class="mb-stack-md text-center">
                <h2 class="font-headline-lg text-headline-lg text-primary mb-2">設定您的登入帳號</h2>
                <p class="font-body-md text-body-md text-on-surface-variant">請設定一組用於管理您的研討會參與和證書下載的帳號密碼。</p>
            </header>
            <form class="space-y-stack-md">
                <!-- Username Field with Loading State -->
                <div class="space-y-stack-sm">
                    <label class="block font-body-md text-body-md font-bold text-primary" for="username">使用者名稱</label>
                    <div class="relative group">
                        <input
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
                    <p class="font-label-sm text-label-sm text-on-surface-variant">建議包含特殊符號以增強安全性</p>
                </div>
                <!-- Confirm Password Field -->
                <div class="space-y-stack-sm">
                    <label class="block font-body-md text-body-md font-bold text-primary"
                        for="confirm_password">再次確認密碼</label>
                    <input
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