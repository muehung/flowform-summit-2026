<script setup>
import { watch } from 'vue';
import { stepNumbers } from '../data/stepProgress'

// https://zh-hk.vuejs.org/guide/essentials/component-basics.html#passing-props
// 宣告接收父元件傳進來的
const propsA = defineProps({
    currentStep: {
        type: Number,
        default: 1,
        required: true,
    }
});

// watch(()=>{
//     console.log(propsA.currentStep)
// })

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

            </div>
        </div>
</template>