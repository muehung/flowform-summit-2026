import { ref, onMounted } from "vue"
import { defineStore } from "pinia"
import router from "../router/router";

const formDefault = {
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
}

export const useFormStore = defineStore('formData', ()=>{
    const form = ref({...formDefault});
    
    const inputFirstFocus =  ref(null);

    const submitGoNext = function(num) {
            console.log(`Moving to step ${num}...`);
            router.push({ path: `/step0${num}` })
    }

    const cancelRegistration = function() {
        form.value = { ...formDefault };
    }

    return { form, STORAGE_KEY, inputFirstFocus, submitGoNext, cancelRegistration }
});