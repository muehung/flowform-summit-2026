<template>
    <!-- TopAppBar -->
    <header class="bg-surface shadow-sm sticky top-0 z-50">
        <div class="flex justify-center items-center w-full px-gutter h-16 max-w-[800px] mx-auto">
            <div class="flex items-center gap-2">
                <RouterLink to="/" class="flex items-center gap-2">
                    <img src="/favicon.svg?v2" class="w-8 h-8" alt="">
                    <h1 class="font-headline-md text-headline-md font-black text-primary tracking-tight">FlowForm</h1>
                </RouterLink>
            </div>
            <!-- <div class="flex items-center gap-4">
                <button
                    class="material-symbols-outlined text-on-surface-variant hover:text-secondary transition-colors text-2xl">account_circle</button>
            </div> -->
        </div>
    </header>
</template>