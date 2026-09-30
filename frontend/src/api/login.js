export const handleLoginApi = async (acValue, pwValue)=>{
    const api = '/api/login';    
    const res = await fetch(api, {
        method: "POST",
        credentials: "include", //允許攜帶 Cookie 等登入憑據
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({"account": acValue, "password": pwValue})
    });
    const data = await res.json();
    if(!res.ok){ throw new Error(`${data.message}`)};

    return data.user
}