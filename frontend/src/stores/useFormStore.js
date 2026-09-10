import { ref } from "vue"
import { defineStore } from "pinia"
import router from "../router/router";

const creatDefaultForm = ()=>{
    return {
        nameX: '',
        email: '',
        phone: '',
        identity: '',
        // 
        company: '',
        department: '',
        jobTitle: '',
        interests: [],
        //
        account:'',
        password: ''
    }
}

export const useFormStore = defineStore('form', ()=>{
    const form = ref(creatDefaultForm());
    
    const inputFirstFocus =  ref(null);

    function submitGoNext(num) {
            console.log(`Moving to step ${num}...`);
            router.push({ path: `/step0${num}` })
    }

    function resetStoreValues() {
        return form.value = creatDefaultForm();
    }

    return { form, inputFirstFocus, submitGoNext, resetStoreValues }
});