<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router';
import Navbar from './../Components/NavbarComponent.vue'
import Footer from './../Components/FooterComponent.vue'
import StepProgress from '../components/StepProgressComponent.vue';
import { stepNumbers } from '../data/stepProgress.js'

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
    departmentOther: '',
    jobTitle: '',
    interests: ''
});

const inputFirstFocus = ref(null);

// use on form department
const selectDepartment =ref("");
const optionOtherValue = ref("");

const departmentValue = computed(()=>{
    // select === other && other's input has value
    if(selectDepartment.value === "other" && optionOtherValue.value !== ""){
        return optionOtherValue.value
    } else {
        return selectDepartment.value
    }
})

// 只要部門 select 沒選到其他，input 其他(error text) 就清空
watch(selectDepartment, (newVal)=>{
    if(newVal !== 'other'){
        optionOtherValue.value = "";
        errors.value.departmentOther = "";
    }
})

// UI 其他欄位的錯誤提示詞是否出現
const isDepartOtherError = computed(()=>{
    // 重新選 selectDepartment 時先不出現
    if(selectDepartment.value !== 'other') {return false }
    return selectDepartment.value === "other" && optionOtherValue.value.trim() === ""; // true
})

const interestOptions = ['Edge Computing', 'Cloud Native', 'Cybersecurity', 'DevOps'];

const handleInterests = function (e){
    // 有紫色的按鈕
    // <button class="px-4 py-2 rounded-full border border-secondary bg-secondary/5 text-secondary flex items-center gap-2"
    //     type="button">
    //     <span class="material-symbols-outlined text-sm"
    //         style="font-variation-settings: 'FILL' 1;">cloud</span>
    //     <span class="font-label-mono text-label-sm">Cloud Native</span>
    // </button>
}

const stepProgress = stepNumbers.find((step)=> step.number === 2);

function validateForm(){
    
    // 驗證公司欄位是否空
    if(form.value.company === ''){
        errors.value.company = '請填寫 公司/組織 名稱';
    } else {
        errors.value.company = ''
    };
    
    // 驗證部門欄位是否空
    if( selectDepartment.value === ''){
        errors.value.department = '請填寫 所屬部門';
    } else {
        errors.value.department = '';
    }
    // 驗證部門的其他欄位是否空
    if (selectDepartment.value === 'other' && optionOtherValue.value === ''){
        errors.value.departmentOther = '請填寫 其他部門';
    } else {
        // 非 other 或 other input 有填寫 error 都清空
        errors.value.departmentOther = '';
    }

    // 職稱非必填
    // 感興趣 非必填

    let isValid = Object.values(errors.value).every(val => val === '')

    if(isValid) {
        form.value.department = departmentValue.value;
    }

    console.log(isValid, 'return value')
    return isValid;
}


const router = useRouter();
function submitGoNext() {
    if(validateForm()){
        console.log('Moving to step 3...');
        router.push({ path: '/step03' })
    }
}

function goPrevious(){
    router.push({ path: '/step01' })
}


</script>
<template>
    <!-- Top Navigation Accent -->
    <div class="h-2 w-full gradient-accent"></div>

    <!-- navbar -->
    <Navbar />

    <main class="max-w-[800px] mx-auto px-margin-mobile md:px-gutter py-stack-lg min-h-[calc(100vh-128px)]">
        
        <!-- step progress -->
        <StepProgress :currentStep="2"/>

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
                        <label class="font-body-md font-bold text-on-surface" for="company">公司/組織名稱
                            <span class="text-red-500 ml-0.5" aria-hidden="true">*</span>
                            <span class="sr-only">必填</span>
                        </label>
                        <div class="relative">
                            <input :value="form.company" @input="form.company = $event.target.value" ref="inputFirstFocus"
                                class="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all bg-surface hover:bg-white"
                                id="company" placeholder="例如：FlowForm 科技" type="text"/>
                                <span v-if="errors.company" class="text-red-500">{{errors.company}}</span>
                            <span
                                class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant">corporate_fare</span>
                        </div>
                        <p class="font-label-mono text-label-sm text-on-surface-variant">請輸入完整法定名稱或常用簡稱</p>
                    </div>
                    <!-- Department Input -->
                    <div class="flex flex-col gap-stack-sm">
                        <label class="font-body-md font-bold text-on-surface" for="department">所屬部門
                            <span class="text-red-500 ml-0.5" aria-hidden="true">*</span>
                            <span class="sr-only">必填</span>
                        </label>
                        <div class="relative">
                            <select
                             :value="selectDepartment"
                             @change="selectDepartment = $event.target.value"
                                class="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all bg-surface hover:bg-white appearance-none"
                                id="department">
                                <option disabled="" value="">請選擇部門...</option>
                                <option value="it">資訊科技 / IT</option>
                                <option value="rd">研發中心 / R&amp;D</option>
                                <option value="design">設計 / Product Design</option>
                                <option value="marketing">市場行銷 / Marketing</option>
                                <option value="operation">維運管理 / Operations</option>
                                <option value="other">其他</option>
                            </select>
                            <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
                        </div>
                        <input type="text" name="other" 
                        v-show="selectDepartment === 'other'" :value="optionOtherValue" 
                        @input="optionOtherValue = $event.target.value"
                        placeholder="請填其他部門名稱" class="w-full mt-2 px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all bg-surface hover:bg-white appearance-none">
                            
                        <span v-show="selectDepartment === '' " class="text-red-500">{{errors.department}}</span>
                        <span v-show="isDepartOtherError" class="text-red-500">{{errors.departmentOther}}</span>

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
                        <button v-for="interest in interestOptions" :key="interest" :value="form.interests" @click="handleInterests"
                            class="px-4 py-2 rounded-full border border-outline-variant hover:border-secondary hover:bg-secondary/5 transition-all flex items-center gap-2 group"
                            type="button">
                            <span
                                class="material-symbols-outlined text-sm text-outline group-hover:text-secondary">memory</span>
                            <span class="font-label-mono text-label-sm">{{interest}}</span>
                        </button>
                        <!-- <button
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
                        </button> -->
                    </div>
                </div>
                <!-- Footer Actions -->
                <div
                    class="pt-stack-lg mt-stack-lg border-t border-outline-variant flex flex-col md:flex-row gap-4 justify-between items-center">
                    <button @click="goPrevious"
                        class="w-full md:w-auto px-8 py-3 rounded-lg border border-primary text-primary font-bold hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group"
                        type="button">
                        <span
                            class="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        上一步
                    </button>
                    <button 
                        class="w-full md:w-auto px-12 py-3 rounded-lg bg-primary text-on-primary font-bold shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                        type="submit">
                        下一步：{{ stepProgress?.text }}
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