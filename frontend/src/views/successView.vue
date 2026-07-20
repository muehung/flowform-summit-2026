<script setup>
import { ref, onMounted } from 'vue'
import Navbar from './../Components/NavbarComponent.vue'
import Footer from './../Components/FooterComponent.vue'


</script>
<template>
    <!-- body以下 -->
    <!-- Top Navigation Accent -->
    <div class="h-2 w-full gradient-accent"></div>

    <!-- navbar -->
    <Navbar />

    <main class="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center relative px-margin-mobile md:px-gutter">
        <!-- Abstract Background Shapes -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
            <div class="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-gradient-start opacity-10 blur-3xl float-animation"
                style="animation-delay: 0s;"></div>
            <div class="absolute top-[40%] right-[10%] w-96 h-96 rounded-full bg-gradient-end opacity-10 blur-3xl float-animation"
                style="animation-delay: 2s;"></div>
            <div class="absolute bottom-[10%] left-[15%] w-72 h-72 rounded-full bg-gradient-middle opacity-10 blur-3xl float-animation"
                style="animation-delay: 4s;"></div>
        </div>
        <!-- Success Content Container -->
        <div class="w-full max-w-[800px] z-10 text-center space-y-stack-lg">
            <!-- Hero Gradient Visual -->
            <div
                class="relative mx-auto w-full max-w-[500px] aspect-[16/9] rounded-xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-500">
                <div class="absolute inset-0 gradient-mesh animate-pulse opacity-20"></div>
                <img class="w-full h-full object-cover mix-blend-multiply"
                    data-alt="A vibrant and professional digital artwork depicting abstract geometric shapes like spheres and grids flowing together. The style is digital abstractism with a multi-chromatic gradient of neon pink, deep purple, and cobalt blue. The lighting is bright and high-key, creating an energetic and celebratory mood suitable for a successful IT seminar registration screen."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAq5OWkleh7xPFFSG_ndcOjR8xzlq_yQneOmddzuWdXObM-mG2uN_tUje8SMeI2KFeo4GSRzBpY9sjnRQoL3Kg4PhZw8C5FYyAiQUUi99jQRZl4gbkxVTU0X_TPZezNHGvtohJMtySDQnCzB4Du5bk2QFObEQStB8X0j95YBI4h6UW9-FUv3EsTeC22rzAtsp6_xNhYIk3awBI1Q6dlwp9kRTW6MaOALZYBWf1D0Crz74eibKoDu-NjtG3GANnAb77BJw7Mm-e5M2o" />
                <div class="absolute inset-0 flex items-center justify-center">
                    <div
                        class="bg-surface/90 backdrop-blur-sm p-stack-md rounded-lg shadow-sm border border-outline-variant/30">
                        <span class="material-symbols-outlined text-success text-[64px]"
                            style="font-variation-settings: 'FILL' 1;">check_circle</span>
                    </div>
                </div>
            </div>
            <div class="space-y-stack-md">
                <h1
                    class="font-display-lg text-display-lg text-primary tracking-tight md:text-display-lg text-headline-lg-mobile">
                    報名成功!
                </h1>
                <p class="font-body-lg text-body-lg text-on-surface-variant max-w-[600px] mx-auto leading-relaxed">
                    您的研討會報名資料已成功送出。我們期待在活動中與您見面。相關活動資訊已寄送至您的信箱，請留意查收。
                </p>
            </div>
            <!-- Bento Card for Event Summary -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-stack-sm text-left">
                <div class="p-stack-md bg-surface-container-low rounded-xl border border-outline-variant/20">
                    <span class="font-label-mono text-label-mono text-secondary mb-2 block">EVENT ID</span>
                    <span class="font-headline-md text-headline-md text-primary">#FF-2026-082</span>
                </div>
                <div
                    class="p-stack-md bg-surface-container-low rounded-xl border border-outline-variant/20 md:col-span-2 flex justify-between items-center">
                    <div>
                        <span class="font-label-mono text-label-mono text-secondary mb-2 block">STATUS</span>
                        <span class="font-headline-md text-headline-md text-success flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-success"></span>
                            CONFIRMED
                        </span>
                    </div>
                    <div class="text-right">
                        <span class="font-label-mono text-label-mono text-on-surface-variant block">REGISTRATION
                            TYPE</span>
                        <span class="font-body-md text-body-md font-bold">VIP Attendee</span>
                    </div>
                </div>
            </div>
            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-stack-md pt-stack-md">
                <button
                    class="w-full sm:w-auto px-10 py-4 bg-primary text-on-primary font-bold rounded-lg hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined">home</span>
                    返回首頁
                </button>
                <button
                    class="w-full sm:w-auto px-10 py-4 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary/5 active:scale-95 transition-all flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined">download</span>
                    下載邀請函
                </button>
            </div>
        </div>
    </main>
    <!-- Top Navigation Accent -->


    <!-- Footer -->
    <Footer />
</template>


<style scoped>
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
</style>