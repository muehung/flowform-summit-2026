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

    <main class="flex-grow w-full max-w-[800px] mx-auto px-margin-mobile md:px-gutter py-stack-lg">
        <!-- Step Progress Bar -->
        <div class="mb-stack-lg relative">
            <div class="absolute top-1/2 left-0 w-full h-[2px] bg-outline-variant -translate-y-1/2 z-0"></div>
            <div class="relative z-10 flex justify-between items-center">
                <!-- Step 1 -->
                <div class="flex flex-col items-center">
                    <div
                        class="w-10 h-10 rounded-full bg-success text-on-primary flex items-center justify-center shadow-sm">
                        <span class="material-symbols-outlined text-[20px]"
                            style="font-variation-settings: 'FILL' 1;">check</span>
                    </div>
                    <span class="hidden md:block mt-2 font-label-sm text-label-sm text-on-surface-variant">基本資料</span>
                </div>
                <!-- Step 2 -->
                <div class="flex flex-col items-center">
                    <div
                        class="w-10 h-10 rounded-full bg-success text-on-primary flex items-center justify-center shadow-sm">
                        <span class="material-symbols-outlined text-[20px]"
                            style="font-variation-settings: 'FILL' 1;">check</span>
                    </div>
                    <span class="hidden md:block mt-2 font-label-sm text-label-sm text-on-surface-variant">身份確認</span>
                </div>
                <!-- Step 3 -->
                <div class="flex flex-col items-center">
                    <div
                        class="w-10 h-10 rounded-full bg-success text-on-primary flex items-center justify-center shadow-sm">
                        <span class="material-symbols-outlined text-[20px]"
                            style="font-variation-settings: 'FILL' 1;">check</span>
                    </div>
                    <span class="hidden md:block mt-2 font-label-sm text-label-sm text-on-surface-variant">帳號設定</span>
                </div>
                <!-- Step 4 Active -->
                <div class="flex flex-col items-center">
                    <div
                        class="w-10 h-10 rounded-full bg-secondary text-on-primary flex items-center justify-center ring-4 ring-secondary/20 animate-pulse">
                        <span class="font-label-mono text-label-mono">04</span>
                    </div>
                    <span class="hidden md:block mt-2 font-label-sm text-label-sm text-secondary font-bold">確認報名</span>
                </div>
            </div>
        </div>
        <!-- Section Title -->
        <section class="mb-stack-md text-center">
            <h2 class="font-headline-lg text-headline-lg text-primary mb-2">確認報名資料</h2>
            <p class="font-body-md text-body-md text-on-surface-variant">請仔細核對以下報名資訊，確認無誤後點擊送出</p>
        </section>
        <!-- Summary Cards (Bento Style) -->
        <div class="bento-grid mb-stack-lg">
            <!-- Basic Info -->
            <div class="bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl">
                <div class="flex items-center gap-2 mb-stack-sm text-primary">
                    <span class="material-symbols-outlined">person</span>
                    <h3 class="font-headline-md text-[18px]">基本資料</h3>
                </div>
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span class="font-label-sm text-on-surface-variant">姓名</span>
                        <span class="font-body-md font-semibold">張 小明</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-label-sm text-on-surface-variant">電子郵件</span>
                        <span class="font-body-md font-semibold">xiaoming.z@example.com</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-label-sm text-on-surface-variant">聯絡電話</span>
                        <span class="font-body-md font-semibold">+886 912 345 678</span>
                    </div>
                </div>
            </div>
            <!-- Identity -->
            <div class="bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl">
                <div class="flex items-center gap-2 mb-stack-sm text-primary">
                    <span class="material-symbols-outlined">badge</span>
                    <h3 class="font-headline-md text-[18px]">身份確認</h3>
                </div>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="font-label-sm text-on-surface-variant">報名身份</span>
                        <span class="bg-tag-bg px-3 py-1 rounded-full font-label-mono text-label-sm text-primary">Senior
                            Developer</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="font-label-sm text-on-surface-variant">所屬單位</span>
                        <span class="font-body-md font-semibold">FlowForm Tech Corp.</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="font-label-sm text-on-surface-variant">興趣標籤</span>
                        <div class="flex gap-1">
                            <span class="bg-tag-bg px-2 py-0.5 rounded text-[10px] font-label-mono">AI</span>
                            <span class="bg-tag-bg px-2 py-0.5 rounded text-[10px] font-label-mono">DevOps</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Hero/Event Info (Wide) -->
            <div class="md:col-span-2 relative h-48 rounded-xl overflow-hidden group">
                <div class="absolute inset-0 z-0">
                    <img class="w-full h-full object-cover"
                        data-alt="A professional and futuristic IT seminar poster background featuring abstract digital light waves in pink, purple, and blue. The aesthetic is clean, energetic, and tech-focused, matching the FlowForm brand. Subtle textures of circuits and data flows are visible in the background, creating a high-end technological atmosphere suitable for a premium developer event."
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLU5tW9uIzqMceSmc9xpK5U0TbROfigla4mP_tgfXkQU674OowWPiVEni6qFHVWuEvdiO4Wwk4qnZ-Vj7qLs82vlVdaPy5mZzOgj9g1k5EuCcYxHp5ZiV7pgA-m5LjxiBr4dmKfNAHZDfEDtXPbAWwv3TWf63g1UwPBP4AnitYyx3T9qVuq6HqVlJ11AQ8NV86k17Pq3TbAmB_l9jXvmGTDJnR8Cu5R8z94E2fM5KVI4eeWRQSTq7jJfru6Np4C6OmnQwh67kyOWo" />
                    <div class="absolute inset-0 bg-primary/60 backdrop-blur-[2px]"></div>
                </div>
                <div class="relative z-10 p-stack-md h-full flex flex-col justify-end text-white">
                    <div class="font-label-mono text-label-sm text-secondary-fixed mb-1 uppercase tracking-widest">IT
                        Seminar 2026</div>
                    <h4 class="font-headline-lg text-headline-lg leading-tight">Agentic AI &amp; Future Infrastructure
                    </h4>
                    <p class="font-body-md text-on-primary-container">Date: December 15, 2026 • Location: Global
                        Innovation Hub</p>
                </div>
            </div>
        </div>
        <!-- Documentation Text Block -->
        <div class="bg-surface-container-low p-stack-md rounded-xl border-l-4 border-secondary mb-stack-lg">
            <h5 class="font-label-sm text-secondary mb-2 uppercase">Seminar Notice</h5>
            <div class="font-body-md text-on-surface-variant leading-relaxed">
                <!-- {{DATA:DOCUMENT:DOCUMENT_6}} -->
            </div>
        </div>
        <!-- Warning Area -->
        <div class="flex items-center gap-3 p-4 bg-error-container/30 border border-error/20 rounded-lg mb-stack-md">
            <span class="material-symbols-outlined text-error">warning</span>
            <p class="font-body-md text-on-error-container font-semibold">送出後將無法修改，請確認所有欄位正確無誤。</p>
        </div>
        <!-- Action Buttons -->
        <div class="flex flex-col md:flex-row gap-4 justify-between items-center mt-stack-lg">
            <button
                class="w-full md:w-auto px-8 py-3 rounded-lg border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group">
                <span
                    class="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                Previous
            </button>
            <button
                class="w-full md:w-auto px-12 py-3 bg-primary text-on-primary rounded-lg font-bold shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                Confirm &amp; Submit
                <span class="material-symbols-outlined">send</span>
            </button>
        </div>
    </main>
    <!-- Top Navigation Accent -->


    <!-- Footer -->
    <Footer />
</template>