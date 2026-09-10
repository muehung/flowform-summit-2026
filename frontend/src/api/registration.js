const baseApi = "/api";

export const createRegistration = async (payload)=>{
    const res = await fetch(`${baseApi}/registrations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify( payload )
    });
    // data 是 response body 解析後的物件
    const data = await res.json();

    // 錯誤就"丟"一個新錯誤訊息
    if(!res.ok) {
        const errMsg = data.message || res.status;
        throw new Error(errMsg)
    }
    return data
}