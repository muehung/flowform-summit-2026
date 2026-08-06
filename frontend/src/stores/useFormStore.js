import { ref, onMounted } from "vue"
import { defineStore } from "pinia"
import router from "../router/router";
import { useStorage } from "@vueuse/core"

const formDefault = {
        name: '',
        email: '',
        phone: '',
        identity: '',
        // 
        company: '',
        department: '',
        jobTitle: '',
        interests: []
}
const errorsDefault = {
        name: '',
        email: '',
        phone: '',
        identity: '',
        // 
        company: '',
        department: '',
        departmentOther: '',
        jobTitle: '',
        interests: ''
};
export const useFormStore = defineStore('formData', ()=>{
    const form = useStorage('form-step', formDefault); // 第2參數本身有帶ref()
    const errors = ref({ ...errorsDefault });
    const inputFirstFocus =  ref(null);

    const submitGoNext = function(num,validateForm) {
        if(validateForm){
            console.log(`Moving to step ${num}...`);
            router.push({ path: `/step0${num}` })
        } else {
            alert('submit go try again')
        }
    }

    const cancelRegistration = function() {
        form.value = { ...formDefault };
        errors.value = { ...errorsDefault }
    }

    return { form, errors, inputFirstFocus, submitGoNext, cancelRegistration }
});