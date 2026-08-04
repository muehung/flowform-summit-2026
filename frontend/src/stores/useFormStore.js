import { ref, onMounted } from "vue"
import { defineStore } from "pinia"
import router from "../router/router";

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

export const useFormStore = defineStore('formData', {
    state: ()=>({
       form: ref({...formDefault}),
       errors: ref({
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
        }),
        inputFirstFocus: ref(null),
    }),
    
    actions: {
        submitGoNext(num,validateForm) {
            if(validateForm){
                console.log(`Moving to step ${num}...`);
                router.push(`/step0${num}`)
            } else {
                alert('請確認資料有無填寫或有錯誤')
            }
        },
        cancelRegistration() {
            this.form = {
                name: '',
                email: '',
                phone: '',
                identity: '',
                company: '',
                department: '',
                jobTitle: '',
                interests: []
            };
            this.errors = {
                name: '',
                email: '',
                phone: '',
                identity: '',
                company: '',
                department: '',
                departmentOther: '',
                jobTitle: '',
                interests: ''
            }
        }

    }
})

// export const useFormButtonStore = defineStore('buttin', ()=>{
//     const inputFirstFocus = ref(null);

//     const submitGoNext = function(num,validateForm) {
//         if(validateForm){
//             console.log(`Moving to step ${num}...`);
//             router.push(`{path:/step0 ${num} }`)
//         } else {
//             alert('submit go try again')
//         }
//     }

//     const cancelRegistration = function() {
//         form.value = {
//             name: '',
//             email: '',
//             phone: '',
//             identity: '',
//         };
//         errors.value = {
//             name: '',
//             email: '',
//             phone: '',
//             identity: '',
//         }
//     }
//     return { inputFirstFocus, submitGoNext, cancelRegistration }
// })