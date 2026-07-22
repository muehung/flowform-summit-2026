<script setup>
import { ref, onMounted, watch } from 'vue'
import Navbar from './../Components/NavbarComponent.vue'
import Footer from './../Components/FooterComponent.vue'

// default form 以防屬性、欄位增減導致壞掉
const formDefault = {
    company: '',
    department: '',
    jobTitle: '',
    interests: []
};

const form = ref({...formDefault});
const errors = ref({
    company: '',
    department: '',
    jobTitle: '',
    interests: ''
});

const inputFirstFocus = ref(null);

onMounted(()=>{
    // 如果有存，先getItem
    const storageData = localStorage.getItem("flowform2026");
    console.log("1", storageData)
    if(storageData){
        try {
            form.value = JSON.parse(storageData)
            console.log("2", storageData)
        } catch(e) {
            console.log("解析 localStorage失敗")
        }
    }
    // 如果沒存，setItem，轉成JSON字串
    localStorage.setItem("flowform2026-1", JSON.stringify(form.value));
    inputFirstFocus.value.focus();
});

//監聽 form 有變化就存
watch(form.value ,()=>{
    // JSON字串轉物件存入
    form.value = JSON.parse(localStorage.getItem("flowform2026"))
    // 轉自json字串存localStorage
    localStorage.setItem("flowform2026-2", JSON.stringify(form.value))
    console.log("3", form.value)
}, {deep: true})

// function validateForm(){
//     if(form.value.company == ''){
//         errors.value.company = '請填寫 公司/組織 名稱';
//     } else {
//         form.value.company == ''
//     }
// }

</script>
<template>
    <!-- body以下 -->
    <!-- Top Navigation Accent -->
    <div class="h-2 w-full gradient-accent"></div>

    <!-- navbar -->
    <Navbar />

    <main class="max-w-[800px] mx-auto px-margin-mobile md:px-gutter py-stack-lg min-h-[calc(100vh-128px)]">
        <!-- Progress Bar -->
        <div class="mb-stack-lg">
            <div class="relative flex items-center justify-between">
                <!-- Progress Line -->
                <div class="absolute top-1/2 left-0 w-full h-[2px] bg-surface-container-highest -translate-y-1/2 -z-10">
                </div>
                <div
                    class="absolute top-1/2 left-0 w-1/2 h-[2px] bg-secondary -translate-y-1/2 -z-10 transition-all duration-500">
                </div>
                <!-- Steps -->
                <div class="flex flex-col items-center">
                    <div
                        class="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-md">
                        <span class="material-symbols-outlined text-xl">check</span>
                    </div>
                    <span class="mt-2 font-label-mono text-label-mono text-secondary">基本資料</span>
                </div>
                <div class="flex flex-col items-center">
                    <div
                        class="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-lg ring-4 ring-secondary/20 step-pulse">
                        <span class="font-label-mono text-lg">2</span>
                    </div>
                    <span class="mt-2 font-label-mono text-label-mono text-secondary font-bold">身份資訊</span>
                </div>
                <div class="flex flex-col items-center">
                    <div
                        class="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center">
                        <span class="font-label-mono text-lg">3</span>
                    </div>
                    <span class="mt-2 font-label-mono text-label-mono text-on-surface-variant">專案需求</span>
                </div>
                <div class="flex flex-col items-center">
                    <div
                        class="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center">
                        <span class="font-label-mono text-lg">4</span>
                    </div>
                    <span class="mt-2 font-label-mono text-label-mono text-on-surface-variant">確認送出</span>
                </div>
            </div>
        </div>
        <!-- Registration Content Card -->
        <div
            class="bg-surface-container-lowest rounded-xl border border-outline-variant p-gutter shadow-sm overflow-hidden">
            <div class="mb-stack-md flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div class="flex items-center gap-2 mb-2">
                        <span
                            class="bg-tag-bg text-on-surface-variant px-3 py-1 rounded-full font-label-mono text-label-sm">STEP
                            02</span>
                        <span
                            class="bg-secondary/10 text-secondary px-3 py-1 rounded-full font-label-mono text-label-sm">職場類身份</span>
                    </div>
                    <h1 class="font-headline-lg text-headline-lg text-primary">補充身份資訊</h1>
                    <p class="text-on-surface-variant mt-2 font-body-md">請協助我們了解您的專業背景，以提供更精確的 IT 研討會議程推薦。</p>
                </div>
            </div>
            <!-- Heroic Brand Graphic (From User Image Reference) -->
            <div class="relative w-full h-48 md:h-64 mb-stack-lg rounded-lg overflow-hidden group">
                <div
                    class="absolute inset-0 bg-gradient-to-br from-gradient-start via-gradient-middle to-gradient-end opacity-20">
                </div>
                <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    data-alt="An abstract digital art composition inspired by generative patterns, featuring fluid multi-chromatic gradients of pink, orange, and blue. The visual style is modern and high-tech, with sharp geometric forms like spheres and rectangles intersecting with soft liquid-like swirls. The lighting is vibrant and high-energy, creating a professional yet innovative atmosphere for a tech conference."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJpb5CR4AMo0Ool5u0N1GU1ArYps2gz97NzjzxeiRBGUuRqjyF95bGfnHkofwEWsLM4uNZUC1VOC6QAb5EGVAbVJRu1xYksaY98YjjEvV1uCopfAvaB1SPuBz47M0ft0fKDfSzPOM-Jt-9viWBfPO3czrIv5xEWrHcZwNF3IMx0TVy4Yju9mAADsDcgSg8G760IkTbeYibHO_20RZKyNx4azw6AMfjHepriyKRMvgdcor3jwxqWbxv6AbmWG8hVBKgC-EOFVyYLjw" />
                <div class="absolute bottom-4 left-4">
                    <div class="bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg border border-white/40 shadow-lg">
                        <span class="font-label-mono text-primary font-bold">Artificial Intelligence (AI) Track</span>
                    </div>
                </div>
            </div>
            <!-- Form Fields -->
            <form class="space-y-stack-md" @submit.prevent="submitGoNext">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                    <!-- Company Input -->
                    <div class="flex flex-col gap-stack-sm">
                        <label class="font-body-md font-bold text-on-surface" for="company">公司/組織名稱</label>
                        <div class="relative">
                            <input :value="form.company" @input="form.company = $event.target.value" ref="inputFirstFocus"
                                class="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all bg-surface hover:bg-white"
                                id="company" placeholder="例如：FlowForm 科技" type="text" />

                                <span v-if="errors.company" class="text-red-500">{{errors.company}}</span>

                            <span
                                class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant">corporate_fare</span>
                        </div>
                        <p class="font-label-mono text-label-sm text-on-surface-variant">請輸入完整法定名稱或常用簡稱</p>
                    </div>
                    <!-- Department Input -->
                    <div class="flex flex-col gap-stack-sm">
                        <label class="font-body-md font-bold text-on-surface" for="department">所屬部門</label>
                        <div class="relative">
                            <select
                                class="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all bg-surface hover:bg-white appearance-none"
                                id="department">
                                <option disabled="" selected="" value="">請選擇部門...</option>
                                <option value="it">資訊科技 / IT</option>
                                <option value="rd">研發中心 / R&amp;D</option>
                                <option value="design">設計 / Product Design</option>
                                <option value="marketing">市場行銷 / Marketing</option>
                                <option value="operation">維運管理 / Operations</option>
                                <option value="other">其他</option>
                            </select>
                            <span v-if="errors.department" class="text-red-500">{{errors.department}}</span>
                            <span
                                class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none">expand_more</span>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-stack-sm">
                    <label class="font-body-md font-bold text-on-surface" for="job-title">職稱</label>
                    <input :value="form.jobTitle" @input="form.jobTitle = $event.target.value"
                        class="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all bg-surface hover:bg-white"
                        id="job-title" placeholder="例如：資深開發工程師" type="text" />
                        <span v-if="errors.jobTitle" class="text-red-500">{{errors.jobTitle}}</span>
                </div>
                <div class="flex flex-col gap-stack-sm">
                    <label class="font-body-md font-bold text-on-surface">感興趣的技術領域 (可多選)</label>
                    <div class="flex flex-wrap gap-2 mt-1">
                        <button :value="form.interests" @click=""
                            class="px-4 py-2 rounded-full border border-outline-variant hover:border-secondary hover:bg-secondary/5 transition-all flex items-center gap-2 group"
                            type="button">
                            <span
                                class="material-symbols-outlined text-sm text-outline group-hover:text-secondary">memory</span>
                            <span class="font-label-mono text-label-sm">Edge Computing</span>
                        </button>
                        <button
                            class="px-4 py-2 rounded-full border border-secondary bg-secondary/5 text-secondary flex items-center gap-2"
                            type="button">
                            <span class="material-symbols-outlined text-sm"
                                style="font-variation-settings: 'FILL' 1;">cloud</span>
                            <span class="font-label-mono text-label-sm">Cloud Native</span>
                        </button>
                        <button
                            class="px-4 py-2 rounded-full border border-outline-variant hover:border-secondary hover:bg-secondary/5 transition-all flex items-center gap-2 group"
                            type="button">
                            <span
                                class="material-symbols-outlined text-sm text-outline group-hover:text-secondary">shield</span>
                            <span class="font-label-mono text-label-sm">Cybersecurity</span>
                        </button>
                        <button
                            class="px-4 py-2 rounded-full border border-outline-variant hover:border-secondary hover:bg-secondary/5 transition-all flex items-center gap-2 group"
                            type="button">
                            <span
                                class="material-symbols-outlined text-sm text-outline group-hover:text-secondary">hub</span>
                            <span class="font-label-mono text-label-sm">DevOps</span>
                        </button>
                    </div>
                </div>
                <!-- Footer Actions -->
                <div
                    class="pt-stack-lg mt-stack-lg border-t border-outline-variant flex flex-col md:flex-row gap-4 justify-between items-center">
                    <button
                        class="w-full md:w-auto px-8 py-3 rounded-lg border border-primary text-primary font-bold hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group"
                        type="button">
                        <span
                            class="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        上一步
                    </button>
                    <button
                        class="w-full md:w-auto px-12 py-3 rounded-lg bg-primary text-on-primary font-bold shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                        type="submit">
                        下一階段：專案需求
                        <span
                            class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                </div>
            </form>
        </div>
        <!-- Help Info -->
        <div class="mt-stack-lg bg-surface-container rounded-lg p-6 border-l-4 border-secondary">
            <div class="flex gap-4">
                <span class="material-symbols-outlined text-secondary">info</span>
                <div>
                    <h4 class="font-bold text-primary mb-1">為什麼我們需要這些資訊？</h4>
                    <p class="text-on-surface-variant font-body-md text-sm">
                        根據 <!-- <!-- {{DATA:DOCUMENT:DOCUMENT_6}} --> -->
                        的規定，研討會的資源分配將優先考量與會者的產業關聯性。您提供的背景資料將協助我們安排分組研討，並確保您能獲得最相關的技術手冊與展示包。
                    </p>
                </div>
            </div>
        </div>
    </main>
    <!-- Top Navigation Accent -->


    <!-- Footer -->
    <Footer />
</template>