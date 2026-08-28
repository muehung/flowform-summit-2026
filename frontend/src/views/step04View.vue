<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import Navbar from './../Components/NavbarComponent.vue';
import Footer from './../Components/FooterComponent.vue';
import StepProgress from './../components/StepProgressComponent.vue';
import LoadingCover from './../components/LoadingCoverComponent.vue';
import { useFormStore } from '../stores/useFormStore.js';

const storeForm = useFormStore();
const { form } = storeToRefs(storeForm);
const { submitGoNext } = storeForm;
const info = form.value;
console.log(info.value)


const { errors, isSubmitting, handleSubmit } = useForm();


// submitting time
// function goSubmiting(){
//     const isLoading = isSubmitting
//   if( isSubmitting === false ) return 
//   isSubmitting
// }
const isLoading = ref(isSubmitting)

const router = useRouter();
// 上一步 button
function goPrevious(){
    router.push({ path: '/step03' })
}

// 下一步 送出
// const goSubmit = handleSubmit(
//     (submitValues)=>{
//     // post api for backend
//     // loading
//     // 失敗 跳提示
//     // 成功 到下一頁
//     },
//     (ctx)=>{

//     }
// )



</script>
<template>
    <!-- Top Navigation Accent -->
    <div class="h-2 w-full gradient-accent"></div>

    <!-- navbar -->
    <Navbar />
    <main class="max-w-[800px] mx-auto px-margin-mobile md:px-gutter py-stack-lg min-h-[calc(100vh-128px)]">
        
        <!-- step progress -->
        <StepProgress :currentStep="4"/>


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
                        <span class="font-body-md font-semibold">{{ info.nameX }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-label-sm text-on-surface-variant">電子郵件</span>
                        <span class="font-body-md font-semibold">{{ info.email }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-label-sm text-on-surface-variant">聯絡電話</span>
                        <span class="font-body-md font-semibold">{{ info.phone }}</span>
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
                        <span v-if="info.identity"
                        class="bg-tag-bg px-3 py-1 rounded-full font-label-mono text-label-mono text-primary">{{ info.identity }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="font-label-sm text-on-surface-variant">所屬單位</span>
                        <span class="font-body-md font-semibold">{{ info.company }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="font-label-sm text-on-surface-variant">興趣標籤</span>
                        <div v-if="info.interests.length > 0">
                            <div class="flex flex-col items-start gap-2">
                                
                                <span v-for="tag in info.interests" :key="tag"
                                class="bg-tag-bg px-2 py-0.5 rounded text-[10px] font-label-mono">{{ tag }}</span>
                                
                            </div>
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
                    <div class="font-label-mono text-label-mono text-secondary-fixed mb-1 uppercase tracking-widest">IT
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
            @click="goPrevious"
                class="w-full md:w-auto px-8 py-3 rounded-lg border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group">
                <span
                    class="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                上一步
            </button>
            <button
                @click="goSubmit"
                class="w-full md:w-auto px-12 py-3 bg-primary text-on-primary rounded-lg font-bold shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                確認送出
                <span class="material-symbols-outlined">send</span>
            </button>
        </div>
    </main>
    <!-- Top Navigation Accent -->


    <!-- Footer -->
    <Footer />

    <LoadingCover v-if="isLoading" />
</template>