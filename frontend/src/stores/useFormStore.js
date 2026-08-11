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
        selectDepartment: '',
        departmentOther: '',
        jobTitle: '',
        interests: []
}

export const useFormStore = defineStore('formData', ()=>{
    const form = ref({...formDefault});
    useStorage('form-step', form); // 第2參數本身有帶ref()
    const inputFirstFocus =  ref(null);

    const submitGoNext = function(num) {
            console.log(`Moving to step ${num}...`);
            router.push({ path: `/step0${num}` })
    }

    const cancelRegistration = function() {
        form.value = { ...formDefault };
        // errors.value = { ...errorsDefault }
    }

    return { form, inputFirstFocus, submitGoNext, cancelRegistration }
});