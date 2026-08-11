import { ref, onMounted } from "vue"
import { defineStore } from "pinia"
import router from "../router/router";
import { useStorage } from "@vueuse/core"

const formDefault = {
        nameX: '',
        email: '',
        phone: '',
        identity: '',
        // 
        company: '',
        department: '',
        jobTitle: '',
        interests: []
}

export const useFormStore = defineStore('formData', ()=>{
    const form = ref({...formDefault});
    const storeVersion = ref("01");
    useStorage( ()=>`form-step${storeVersion.value}`, form, localStorage, { mergeDefaults: true } ); 
    // 第2參數本身有帶ref(), 第4參數mergeDefaults: true 新增欄位而 LocalStorage 的資料缺少該欄位，會自動把預設值補進去
    const inputFirstFocus =  ref(null);

    const submitGoNext = function(num) {
            console.log(`Moving to step ${num}...`);
            router.push({ path: `/step0${num}` })
    }

    const cancelRegistration = function() {
        form.value = { ...formDefault };
        // errors.value = { ...errorsDefault }
    }

    return { form, storeVersion, inputFirstFocus, submitGoNext, cancelRegistration }
});