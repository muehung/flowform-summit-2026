import { ref } from 'vue'
import { defineStore } from 'pinia'
import { handleLoginApi } from '../api/login'
import { handleLogoutApi } from '../api/logout'
import { handleCheckLoginApi } from '../api/auth/me'

export const useAuthStore = defineStore('user', ()=>{

    const userInfo = ref(null);

    const isLoggedIn = ref(false);

    const sessionChecked = ref(false);

    async function restoreSession(){
        userInfo.value = null;
        isLoggedIn.value = false;
        sessionChecked.value = false;

        try {
            const user = await handleCheckLoginApi();
            userInfo.value = user;
            isLoggedIn.value = true;
            sessionChecked.value = true;
            
        } catch (error) {
            userInfo.value = null;
            isLoggedIn.value = false;

            if(error.status === 401) {
                sessionChecked.value = true;
                return
            }
            throw error
        }
    }

    async function login(account, pw){
            const dataUser = await handleLoginApi(account, pw)
            if(!dataUser){ throw new Error("登入錯誤，請重新輸入帳號密碼")}
            userInfo.value = dataUser;
            isLoggedIn.value = true;
            sessionChecked.value = true;

            return dataUser
    };

    async function logout(){
        await handleLogoutApi()
        // 登出成功，清除登出資料
        userInfo.value = null;
        isLoggedIn.value = false;
        sessionChecked.value = true;
    }
    
    return { userInfo, isLoggedIn, sessionChecked, restoreSession, login, logout }
})