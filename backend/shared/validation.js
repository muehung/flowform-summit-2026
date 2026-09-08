const registrationTypeMap = {
    developer: '一般',
    devops: '一般',
    student: '學生',
    manager: '一般',
    designer: '一般',
    vip: 'VIP',
    speaker: 'VIP',
    public: '一般'
};

export const existingAccounts = ['admin', 'test', 'flowform', 'user123'];

export function normalizeAccount(account) {
    return account.trim().toLowerCase();
}

export function getRegistrationType(identity) {
    return registrationTypeMap[identity];
}

export function validateRegistration(data) {
    const errors = {};
    for (const field of ['name', 'email', 'phone', 'identity', 'account', 'password']) {
        if (typeof data[field] !== 'string' || data[field].trim() === '') {
            errors[field] = '此欄位為必填';
        }
    }
    for (const field of ['company', 'department', 'jobTitle']) {
        if (data[field] !== undefined && typeof data[field] !== 'string') {
            errors[field] = '此欄位必須是字串';
        }
    }
    if (data.interests !== undefined && !Array.isArray(data.interests)) {
        errors.interests = '興趣必須是陣列';
    }
    if (typeof data.identity === 'string' && data.identity.trim() !== '' && !getRegistrationType(data.identity)) {
        errors.identity = '註冊身分選項不正確';
    }
    if (
        typeof data.password === 'string' &&
        (data.password.length < 8 || data.password.length > 20 || !/[A-Z]/.test(data.password) || !/[a-z]/.test(data.password) || !/\d/.test(data.password))
    ) {
        errors.password = '密碼需為 8 到 20 個字元，且包含大小寫英文字母與數字';
    }
    return errors;
}
