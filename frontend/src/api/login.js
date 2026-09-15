export const handleLoginApi = async (acValue, pwValue)=>{
    const api = '/api/login';    
    const res = await fetch(api, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({"account": acValue, "password": pwValue})
    });
    if(!res.ok){ throw new Error(`${res.status} 錯誤`)};

    const data = await res.json();
    return data.user
}