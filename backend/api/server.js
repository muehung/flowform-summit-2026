import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';

import { randomUUID } from 'node:crypto';
import {
    mkdir,
    readFile,
    writeFile
} from 'node:fs/promises';

const app = express();
const PORT = 3000;

// database.json 會建立在 backend/data/database.json
const databaseDirectoryUrl = new URL(
    '../data/',
    import.meta.url
);

const databaseFileUrl = new URL(
    '../data/database.json',
    import.meta.url
);

app.use(cors());
app.use(express.json());

// 模擬原本已經被使用的保留帳號
const existingAccounts = [
    'admin',
    'test',
    'flowform',
    'user123'
];

// 表單 identity 與後端報名身分的對照
const registrationTypeMap = {
    '軟體開發者 (Developer)': '一般',
    '維運工程師 (DevOps)': '一般',
    '在學學生 (Student)': '學生',
    '技術經理 (Manager)': '一般',
    '設計師 (Designer)': '一般',
    '貴賓 (VIP)': 'VIP',
    '講者 (Speaker)': 'VIP',
    '民眾': '一般'
};

/*
 * 讓 Express 4 可以把 async function
 * 發生的錯誤交給統一錯誤處理 middleware。
 */
function asyncHandler(handler) {
    return (req, res, next) => {
        Promise.resolve(handler(req, res, next))
            .catch(next);
    };
}

// 統一整理帳號格式
function normalizeAccount(account) {
    return account.trim().toLowerCase();
}

// 根據 identity 取得學生、VIP 或一般身分
function getRegistrationType(identity) {
    return registrationTypeMap[identity];
}

// 第一次啟動後端時，自動建立 data/database.json
async function ensureDatabase() {
    await mkdir(databaseDirectoryUrl, {
        recursive: true
    });

    try {
        const content = await readFile(
            databaseFileUrl,
            'utf-8'
        );

        const database = JSON.parse(content);

        if (!Array.isArray(database.registrations)) {
            throw new Error(
                'database.json 缺少 registrations 陣列'
            );
        }
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }

        const initialDatabase = {
            registrations: []
        };

        await writeFile(
            databaseFileUrl,
            JSON.stringify(initialDatabase, null, 2),
            'utf-8'
        );
    }
}

// 讀取 JSON 模擬資料庫
async function readDatabase() {
    const content = await readFile(
        databaseFileUrl,
        'utf-8'
    );

    return JSON.parse(content);
}

// 寫入 JSON 模擬資料庫
async function writeDatabase(database) {
    await writeFile(
        databaseFileUrl,
        JSON.stringify(database, null, 2),
        'utf-8'
    );
}

/*
 * 帳號檢查 API 和正式報名 API
 * 共用同一套帳號重複判斷。
 */
function isAccountTaken(account, registrations) {
    const normalizedAccount =
        normalizeAccount(account);

    const isPresetAccount =
        existingAccounts.includes(
            normalizedAccount
        );

    const isRegisteredAccount =
        registrations.some(
            (registration) =>
                registration.account ===
                normalizedAccount
        );

    return (
        isPresetAccount ||
        isRegisteredAccount
    );
}

// 驗證正式報名資料
function validateRegistration(data) {
    const errors = {};

    const requiredStringFields = [
        'name',
        'email',
        'phone',
        'identity',
        'account',
        'password'
    ];

    const optionalStringFields = [
        'company',
        'department',
        'jobTitle'
    ];

    requiredStringFields.forEach((field) => {
        if (
            typeof data[field] !== 'string' ||
            data[field].trim() === ''
        ) {
            errors[field] = '此欄位為必填';
        }
    });

    optionalStringFields.forEach((field) => {
        if (
            data[field] !== undefined &&
            typeof data[field] !== 'string'
        ) {
            errors[field] =
                '此欄位必須是字串';
        }
    });

    if (
        data.interests !== undefined &&
        !Array.isArray(data.interests)
    ) {
        errors.interests =
            '興趣必須是陣列';
    }

    if (
        typeof data.identity === 'string' &&
        data.identity.trim() !== '' &&
        getRegistrationType(
            data.identity
        ) === undefined
    ) {
        errors.identity =
            '註冊身分選項不正確';
    }

    return errors;
}

// Step03：檢查帳號是否可用
app.post(
    '/api/check-account',
    asyncHandler(async (req, res) => {
        const { account } = req.body ?? {};

        if (
            typeof account !== 'string' ||
            account.trim() === ''
        ) {
            return res.status(400).json({
                message: '請提供要檢查的帳號',
                code: 'INVALID_ACCOUNT'
            });
        }

        const database =
            await readDatabase();

        const normalizedAccount =
            normalizeAccount(account);

        const available = !isAccountTaken(
            normalizedAccount,
            database.registrations
        );

        // 模擬一秒的網路延遲
        setTimeout(() => {
            return res.status(200).json({
                message: available
                    ? '此帳號可以使用'
                    : '此帳號已被使用',

                account: normalizedAccount,
                available
            });
        }, 1000);
    })
);

// Step04：正式建立報名資料
app.post(
    '/api/registrations',
    asyncHandler(async (req, res) => {
        const registrationData =
            req.body ?? {};

        const errors =
            validateRegistration(
                registrationData
            );

        if (
            Object.keys(errors).length > 0
        ) {
            return res.status(400).json({
                message:
                    '報名資料格式不正確',

                code: 'VALIDATION_ERROR',
                errors
            });
        }

        const database =
            await readDatabase();

        const account =
            normalizeAccount(
                registrationData.account
            );

        /*
         * Step03 即使已經檢查過，
         * 正式送出時仍要再次確認帳號。
         */
        if (
            isAccountTaken(
                account,
                database.registrations
            )
        ) {
            return res.status(409).json({
                message:
                    '此帳號已被使用，請返回上一步更換帳號',

                code: 'ACCOUNT_TAKEN'
            });
        }

        /*
         * 將使用者輸入的明碼密碼轉成雜湊值。
         * database.json 只保存 passwordHash，
         * 不保存 registrationData.password。
         */
        const passwordHash =
            await bcrypt.hash(
                registrationData.password,
                10
            );

        // 建立一筆新的報名資料
        const newRegistration = {
            registrationId: randomUUID(),

            status: 'registered',

            registrationType:
                getRegistrationType(
                    registrationData.identity
                ),

            name:
                registrationData.name.trim(),

            email:
                registrationData.email.trim(),

            phone:
                registrationData.phone.trim(),

            identity:
                registrationData.identity,

            company:
                registrationData.company
                    ?.trim() ?? '',

            department:
                registrationData.department
                    ?.trim() ?? '',

            jobTitle:
                registrationData.jobTitle
                    ?.trim() ?? '',

            interests:
                registrationData.interests ?? [],

            account,
            passwordHash,

            createdAt:
                new Date().toISOString()
        };

        // 模擬把報名資料寫進資料庫
        database.registrations.push(
            newRegistration
        );

        await writeDatabase(database);

        /*
         * 回應前端時不包含 password，
         * 也不包含 passwordHash。
         */
        return res.status(201).json({
            message: '報名成功',

            registration: {
                registrationId:
                    newRegistration
                        .registrationId,

                status:
                    newRegistration.status,

                name:
                    newRegistration.name,

                registrationType:
                    newRegistration
                        .registrationType
            }
        });
    })
);

// 登入：驗證帳號與密碼
app.post(
    '/api/login',
    asyncHandler(async (req, res) => {
        const {
            account,
            password
        } = req.body ?? {};

        if (
            typeof account !== 'string' ||
            account.trim() === '' ||
            typeof password !== 'string' ||
            password === ''
        ) {
            return res.status(400).json({
                message:
                    '請輸入帳號與密碼',

                code:
                    'INVALID_LOGIN_DATA'
            });
        }

        const database =
            await readDatabase();

        const normalizedAccount =
            normalizeAccount(account);

        const user =
            database.registrations.find(
                (registration) =>
                    registration.account ===
                    normalizedAccount
            );

        /*
         * 不分開顯示「帳號不存在」，
         * 避免讓外部使用者確認某帳號是否存在。
         */
        if (!user) {
            return res.status(401).json({
                message:
                    '帳號或密碼錯誤',

                code:
                    'INVALID_CREDENTIALS'
            });
        }

        const passwordMatched =
            await bcrypt.compare(
                password,
                user.passwordHash
            );

        if (!passwordMatched) {
            return res.status(401).json({
                message:
                    '帳號或密碼錯誤',

                code:
                    'INVALID_CREDENTIALS'
            });
        }

        /*
         * 登入成功。
         * 目前只回傳使用者基本資料，
         * 尚未加入 Token 或 Session。
         */
        return res.status(200).json({
            message: '登入成功',

            user: {
                registrationId:
                    user.registrationId,

                account:
                    user.account,

                name:
                    user.name,

                registrationType:
                    user.registrationType
            }
        });
    })
);

// 統一處理錯誤
app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    // 前端傳入的 JSON 語法錯誤
    if (
        error instanceof SyntaxError &&
        error.status === 400 &&
        'body' in error
    ) {
        return res.status(400).json({
            message: 'JSON 格式不正確',
            code: 'INVALID_JSON'
        });
    }

    console.error(
        `後端發生非預期錯誤：${req.method} ${req.originalUrl}`,
        error.message
    );

    return res.status(500).json({
        message:
            '系統暫時無法處理請求，請稍後再試',

        code:
            'INTERNAL_SERVER_ERROR'
    });
});

// 確認 database.json 後，再啟動伺服器
ensureDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(
                `測試後端伺服器已啟動：http://localhost:${PORT}`
            );
        });
    })
    .catch((error) => {
        console.error(
            '後端啟動失敗：',
            error.message
        );

        process.exit(1);
    });