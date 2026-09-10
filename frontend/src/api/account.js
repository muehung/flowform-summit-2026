export const handleAccountApi = async (value)=>{
    const url = "/api/check-account";
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ account: value }),
    });
    if(!res.ok){ throw new Error(res.status + "錯誤") }
    const data = await res.json(); // 相當於 JSON.parse
    
    return data.available
}