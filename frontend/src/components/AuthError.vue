<script setup>
import router from '../router/router';
</script>
<template>
    <main class="text-center">
        <h3 class="mt-10 p-3">暫時無法確認登入狀態</h3>
        <div class="flex justify-center gap-5 text-center">
            <button
            @click="router.push('/dashboard')"
            type="button" class="border-2 p-2 rounded-lg">連到 /dashboard「重試」</button>
            <button
            @click="router.push('/')"
            type="button" class="border-2 p-2 rounded-lg">回首頁</button>
        </div>
        
    </main>
</template>