<script setup>
import { onMounted, ref, watch } from 'vue';

// https://zh-hk.vuejs.org/guide/essentials/component-basics.html#passing-props
// 宣告接收父元件傳進來的
const propsA = defineProps({
    currentStep: {
        type: Number,
        default: 1,
        required: true,
    }
});

const stepNumbers = [{
        number: 1,
        text: "基本資料"
    },{
        number: 2,
        text: "補充身份資訊"
    },{
        number: 3,
        text: "設定帳號"
    },{
        number: 4,
        text: "確認送出"
    },
]

watch(()=>{
    console.log(propsA.currentStep)
})

// https://zh-hk.vuejs.org/guide/components/props.html

// step have 3 statuses: 
// 1. 現在當前頁 2. 已看完頁 3.尚未看頁
// add thisStep, finishStep, undoStep

// progress line
// 是2條線組合，所以傳入2個字串到template，去改變tailwind


</script>
<template>
    <!-- Progress Bar -->
        <div class="mb-stack-lg">
            <div class="flex items-center justify-between relative mb-2">
                <!-- Progress Line -->
                <div class="absolute top-1/3 left-0 w-full h-[2px] bg-surface-container-highest -z-10">
                </div>
                <div class="absolute top-1/3 -translate-y-1/2 left-0 h-[2px] bg-secondary -z-10 transition-all duration-500"
                    :class="{
                        'w-[10px]': currentStep === 1 || currentStep < 1,
                        'w-1/3': currentStep === 2,
                        'w-2/3': currentStep === 3,
                        'w-full': currentStep === 4 }
                ">
                </div>
                <!-- Steps -->
                
                    <div v-for="{number, text} in stepNumbers" :key="number">
                        
                        <div v-if="currentStep < number">
                                <div class="flex flex-col items-center">
                                    <div
                                        class="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center">
                                        <span class="font-label-mono text-lg">{{number}}</span>
                                    </div>
                                    <span class="mt-2 font-label-sm text-label-mono text-on-surface-variant">{{text}}</span>
                                </div>
                            </div>
                            <div v-else-if="currentStep === number">
                                <div class="flex flex-col items-center">
                                    <div class="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center ring-4 shadow-md">
                                        <!-- <span class="material-symbols-outlined text-xl">check</span> -->
                                        <span class="font-label-mono text-lg">{{number}}</span>
                                    </div>
                                    <span class="mt-2 font-label-sm text-label-mono text-secondary">{{text}}</span>
                                </div>
                            </div>
                            <div v-else-if="currentStep > number">
                                <div class="flex flex-col items-center">
                                    <div class="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-md">
                                        <span class="material-symbols-outlined text-xl">check</span>
                                    </div>
                                    <span class="mt-2 font-label-sm text-label-mono text-secondary">{{text}}</span>
                                </div>
                            </div>

                    </div>

                    <!-- <div v-if="currentStep < 2">
                        <div class="flex flex-col items-center">
                            <div
                                class="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center">
                                <span class="font-label-mono text-lg">2</span>
                            </div>
                            <span class="mt-2 font-label-sm text-label-mono text-on-surface-variant">身份資訊</span>
                        </div>
                    </div>
                    <div v-else-if="currentStep === 2">
                        <div class="flex flex-col items-center">
                            <div class="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center ring-4 shadow-md">
                                 <span class="font-label-mono text-lg">2</span>
                            </div>
                            <span class="mt-2 font-label-sm text-label-mono text-secondary">身份資訊</span>
                        </div>
                    </div>
                    <div v-else-if="currentStep > 2">
                        <div class="flex flex-col items-center">
                            <div class="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-md">
                                <span class="material-symbols-outlined text-xl">check</span>
                            </div>
                            <span class="mt-2 font-label-sm text-label-mono text-secondary">身份資訊</span>
                        </div>
                    </div> -->
                    
                <!-- <div class="flex flex-col items-center">
                    <div
                        class="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-lg ring-4 ring-secondary/20 step-pulse">
                        <span class="font-label-mono text-lg">2</span>
                    </div>
                    <span class="mt-2 font-label-sm text-label-mono text-secondary font-bold">身份資訊</span>
                </div> -->
                
                <!-- <div class="flex flex-col items-center">
                    <div
                        class="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center">
                        <span class="font-label-mono text-lg">3</span>
                    </div>
                    <span class="mt-2 font-label-sm text-label-mono text-on-surface-variant">專案需求</span>
                </div>
                <div class="flex flex-col items-center">
                    <div
                        class="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center">
                        <span class="font-label-mono text-lg">4</span>
                    </div>
                    <span class="mt-2 font-label-sm text-label-mono text-on-surface-variant">確認送出</span>
                </div> -->
            </div>
        </div>
</template>