<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import dashboardNavbar from './../components/dashboardNavbar.vue';
import Footer from './../components/Footer.vue';
import loadingView from './../components/LoadingCover.vue'
import { useAuthStore } from '../stores/useAuthStore.js';
import { getRegistrationsApi } from '../api/registration.js';

const useUser = useAuthStore();
const { userInfo, isLoggedIn, sessionChecked } = storeToRefs(useUser);

const registrations = ref([]);
const isLoading = ref(false);
const errorMessage = ref("");

const loadRegistrations = async ()=>{
    isLoading.value = true;
    try {
        registrations.value = await getRegistrationsApi()
        isLoading.value = false;
    } catch(error) {
        errorMessage.value = error;
    }
}
onMounted(loadRegistrations);

const PAGINATION_MAX = ref(10);
const currentPage = ref(1);

// 第1頁 1  - 10 筆 [0 - 10]
// 第2頁 11 - 20 筆 [10 - 20]
// 第3頁 21 - 30 筆 [20 - 30]
const start = (currentPage.value - 1) * PAGINATION_MAX.value;
const end = currentPage.value * PAGINATION_MAX.value;
const slicedRegistrations = computed(()=> {
        registrations.value.slice(start, end)
    }
)


const setPage = (page)=>{
    currentPage.value = page;
    slicedRegistrations();
};
const pageTotal = computed(()=>{
    return Math.ceil(registrations.value.length / PAGINATION_MAX.value);
});

// UI select value
const pageDisplayPer = ref(PAGINATION_MAX);


</script>
<template>

    <!-- navbar -->
    <dashboardNavbar />

    <main class="min-h-[800px] flex gap-3 flex-col pt-5 px-3">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-baseline gap-3">
                <h1 class="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">報名資料列表
                </h1><span
                    class="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-mono text-xs font-semibold">共
                    {{ registrations?.length || 0 }} 筆報名資料</span>
            </div>
            <div class="flex items-center gap-3">
                <button @click="loadRegistrations"
                    class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-outline-variant/60 bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-body-md text-xs shadow-sm hover:bg-surface-container-low transition-colors"
                    type="button"><span
                        class="material-symbols-outlined text-[16px]">refresh</span><span>重新整理</span></button>
            </div>
        </div>

        <!-- <div class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-4 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div class="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap w-full lg:w-auto">
                <div class="flex items-center gap-1.5 flex-wrap"><span
                        class="text-xs font-medium text-on-surface-variant mr-1">身分類別：</span><button
                        class="px-2.5 py-1 rounded-lg bg-primary text-on-primary font-body-md text-xs transition-colors"
                        type="button">全部</button><button
                        class="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-body-md text-xs transition-colors"
                        type="button">開發者</button><button
                        class="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-body-md text-xs transition-colors"
                        type="button">DevOps</button><button
                        class="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-body-md text-xs transition-colors"
                        type="button">學生</button><button
                        class="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-body-md text-xs transition-colors"
                        type="button">主管</button><button
                        class="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-body-md text-xs transition-colors"
                        type="button">設計師</button></div>
                <div class="h-4 w-px bg-outline-variant hidden sm:block"></div>
                <div class="flex items-center gap-1.5 flex-wrap"><span
                        class="text-xs font-medium text-on-surface-variant mr-1">報名類型：</span><button
                        class="px-2.5 py-1 rounded-lg bg-primary text-on-primary font-body-md text-xs transition-colors"
                        type="button">全部</button><button
                        class="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-body-md text-xs transition-colors"
                        type="button">一般</button><button
                        class="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-body-md text-xs transition-colors"
                        type="button">學生</button><button
                        class="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-body-md text-xs transition-colors"
                        type="button">VIP</button></div>
            </div>
            <div class="relative w-full lg:w-72"><span
                    class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">search</span><input
                    class="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body-md text-xs focus:outline-none focus:ring-2 focus:ring-secondary/20"
                    placeholder="搜尋姓名、報名編號、Email..." type="text"></div>
        </div> -->
        <div
            class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
            <div class="w-full overflow-x-auto">
                <p>{{ errorMessage }}</p>
                <table v-if="registrations"
                class="w-full text-left border-collapse">
                    <thead>
                        <tr
                            class="bg-surface-container-high/60 text-on-surface font-label-sm text-xs font-semibold select-none border-b border-surface-container">
                            <th class="px-5 py-3.5" scope="col">No.
                            </th>
                            <th class="px-5 py-3.5" scope="col">報名編號
                                <button type="button" class="bg-white py-.5 px-1.5 rounded-md text-black/40 hover:text-purple-500 hover:bg-purple-100">v</button>
                            </th>
                            <th class="px-5 py-3.5" scope="col">姓名
                            </th>
                            <th class="px-5 py-3.5" scope="col">Email
                            </th>
                            <th class="px-5 py-3.5" scope="col">身分類別
                                <button type="button" class="bg-white py-.5 px-1.5 rounded-md text-black/40 hover:text-purple-500">v</button>
                            </th>
                            <th class="px-5 py-3.5" scope="col">公司組織
                            </th>
                            <th class="px-5 py-3.5" scope="col">報名類型
                                <button type="button" class="bg-white py-.5 px-1.5 rounded-md text-black/40 hover:text-purple-500">v</button>
                            </th>
                            <th class="px-5 py-3.5" scope="col">報名時間
                                <button type="button" class="bg-white py-.5 px-1.5 rounded-md text-black/40 hover:text-purple-500">v</button>
                            </th>
                        </tr>
                    </thead>
                    <tbody 
                    v-if="registrations"
                    class="divide-y divide-surface-container-low font-body-md text-xs">
                        <tr v-for="(n,index) in slicedRegistrations" :key="n.registrationId"
                        class="hover:bg-surface-container-low/60 transition-colors">
                            <td class="px-5 py-4 font-semibold text-on-surface">{{ index + 1 }}</td>
                             <td class="px-5 py-4 font-label-mono font-medium text-secondary">{{ n.registrationId }}</td>
                             <td class="px-5 py-4 font-semibold text-on-surface">{{ n.name }}</td>
                            <td class="px-5 py-4 font-label-mono text-on-surface">{{ n.email }}</td>
                            <td class="px-5 py-4">
                                <span v-if="n.jobTitle"
                                    class="px-2.5 py-1 rounded bg-surface-container text-on-surface font-medium text-[11px]">{{ n.jobTitle }}</span>
                            </td>
                            <td class="px-5 py-4 font-medium text-on-surface">{{ n.company }}</td>
                            <td class="px-5 py-4"><span
                                    class="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-secondary font-medium text-[11px]">{{ n.registrationType }}</span>
                            </td>
                            <!-- <td class="px-5 py-4 font-label-mono text-on-surface-variant">2024/05/20 14:32</td> -->
                             <td class="px-5 py-4 font-label-mono text-on-surface-variant">{{ n.createdAt }}</td>
                        </tr>
                        
                    </tbody>
                </table>
            </div>
            <div
                class="px-5 py-4 bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-surface-container-low">
                <div class="flex items-center gap-4 text-xs font-label-mono text-on-surface-variant">
                    <div class="flex items-center gap-1.5"><span>每頁顯示</span>
                        <div class="relative">
                            <select v-model="pageDisplayPer"
                            class="appearance-none bg-surface-container-low text-on-surface pl-2.5 pr-6 py-1 rounded-lg text-xs font-label-mono focus:outline-none cursor-pointer">
                                <option selected="" value="10">10 筆</option>
                                <option value="20">20 筆</option>
                                <option value="50">50 筆</option>
                            </select><span
                                class="material-symbols-outlined pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[14px] text-on-surface-variant">expand_more</span>
                        </div>
                    </div><span class="text-outline-variant">|</span><span>顯示第 1 至 {{ pageTotal }} 筆，共 {{ registrations?.length || 0 }} 筆</span>
                </div>
                
<!-- const currentPage
const pageTotal
const setPage -->
                <nav aria-label="分頁導航" class="flex items-center gap-1">
                    <button @click="setPage( currentPage - 1 )"
                    class="px-2.5 py-1.5 rounded-lg font-label-mono text-xs flex items-center gap-1"
                    :class="currentPage === 1 ? 'bg-surface-container-low text-outline-variant cursor-not-allowed' : 'bg-surface-container-low hover:bg-surface-container text-on-surface font-label-mono' "
                        :disabled="currentPage === 1" type="button"><span
                            class="material-symbols-outlined text-[14px]">chevron_left</span><span>上一頁</span></button>
                    <div
                     v-for="n in pageTotal" :key="n"
                     class="flex items-center gap-1 px-1">
                        <button
                        @click="setPage(n);"
                        :class="currentPage === n ? 'bg-primary/90 text-on-primary' : 'hover:bg-surface-container-low text-on-surface transition-colors font-label-mono' "
                            class="w-8 h-8 rounded-lg font-label-mono text-xs font-semibold"
                            type="button">{{n}}</button>
                        <!-- <button
                            class="w-8 h-8 rounded-lg text-xs"
                            type="button">2</button> -->
                    </div>
                    <button @click="setPage( currentPage + 1 )"
                        class="px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-mono text-xs transition-colors flex items-center gap-1"
                        :class="currentPage === pageTotal ? 'bg-surface-container-low text-outline-variant  cursor-not-allowed' : 'bg-surface-container-low hover:bg-surface-container text-on-surface font-label-mono' "
                        :disabled="currentPage === pageTotal"
                        type="button"><span>下一頁</span><span
                            class="material-symbols-outlined text-[14px]">chevron_right</span></button>
                </nav>
            </div>
        </div>
        <loadingView v-if="isLoading" />
    </main>

    <!-- Footer -->
    <Footer />
</template>
