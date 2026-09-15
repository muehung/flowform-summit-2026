export const handleCheckLoginApi = async ()=>{
    const url = "/api/auth/me";
    const res = await fetch(url,{
        credentials: "include",
    });
    
    if(!res.ok) {throw new Error(`${res.status} 錯誤`)};
    const data = await res.json();

    return data.user
}