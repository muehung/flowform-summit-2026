export const handleCheckLoginApi = async ()=>{
    const url = "/api/auth/me";
    const res = await fetch(url,{
        credentials: "include",
    });
    
    if(!res.ok) {
        const error = new Error(`${res.status} 錯誤`);
        error.status = res.status;
        throw error;
    };
    const data = await res.json();

    // 若收到格式異常的 200，store 會把 `undefined` 當成已登入。建議檢查 `data.user`，缺少時拋出錯誤，不要設定登入狀態。
    if(data.user === null || data.user === undefined || typeof(data.user) === Number || typeof(data.user) === String) {
        throw new Error('登入狀態回應格式錯誤')
    }
    
    return data.user
}