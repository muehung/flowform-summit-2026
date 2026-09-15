export const handleLogoutApi = async ()=>{
    const api = '/api/logout';    
    const res = await fetch(api, {
        method: "POST",
        credentials: "include",
    });
    if(!res.ok){ throw new Error(`${res.status} 錯誤`)};

    return res.status
}