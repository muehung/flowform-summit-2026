import {
    createPasswordRecord,
    createSessionToken
} from '../shared/auth.js';
import {
    getRegistrationType,
    isValidPassword,
    normalizeAccount
} from '../shared/validation.js';

export const DASHBOARD_SEED_BATCH = 'dashboard-v1';
export const TEST_MEMBER_SEED_BATCH = 'member-access-v1';
export const TEST_MEMBER_ACCOUNTS = [
    'member-test-01',
    'member-test-02'
];

function passwordFields(passwordRecord) {
    return {
        passwordAlgorithm: passwordRecord.algorithm,
        passwordIterations: passwordRecord.iterations,
        passwordSalt: passwordRecord.salt,
        passwordHash: passwordRecord.hash
    };
}

function createSeedEntry({
    number,
    seedBatch,
    account,
    passwordRecord,
    name,
    email,
    phone,
    identity,
    company,
    department,
    jobTitle,
    interests,
    createdAt
}) {
    const suffix = String(number).padStart(3, '0');
    const userId = `${seedBatch}-user-${suffix}`;
    return {
        user: {
            id: userId,
            account,
            ...passwordFields(passwordRecord),
            role: 'user',
            retentionExempt: 1,
            seedBatch,
            createdAt,
            expiresAt: createdAt
        },
        registration: {
            id: `${seedBatch}-registration-${suffix}`,
            userId,
            status: 'registered',
            registrationType: getRegistrationType(identity),
            name,
            email,
            phone,
            identity,
            company,
            department,
            jobTitle,
            interestsJson: JSON.stringify(interests),
            retentionExempt: 1,
            seedBatch,
            createdAt,
            expiresAt: createdAt
        }
    };
}

export async function createOrUpdateAdmin({ dao, account, password, now = Date.now }) {
    if (typeof account !== 'string' || !account.trim()) {
        throw new Error('FLOWFORM_ADMIN_ACCOUNT 不可為空白');
    }
    if (!isValidPassword(password)) {
        throw new Error('FLOWFORM_ADMIN_PASSWORD 必須為 8～20 字元，並包含大小寫英文字母與數字');
    }
    const createdAt = now();
    const passwordRecord = await createPasswordRecord(password);
    dao.upsertAdmin({
        id: crypto.randomUUID(),
        account: normalizeAccount(account),
        ...passwordFields(passwordRecord),
        createdAt,
        expiresAt: createdAt
    });
}

export async function seedDashboard({ dao }) {
    const identities = [
        'developer', 'devops', 'student', 'manager',
        'designer', 'vip', 'speaker', 'public'
    ];
    const interests = [
        ['JavaScript', 'Vue'],
        ['Cloudflare'],
        ['UI/UX', 'Frontend'],
        [],
        ['DevOps', 'Security']
    ];
    const familyNames = ['陳', '林', '黃', '張', '李', '王', '吳', '劉', '蔡', '楊'];
    const givenNames = ['小安', '怡君', '志明', '雅婷', '柏宇', '欣怡', '冠廷', '雨柔', '家豪', '佳穎'];
    const baseTime = Date.UTC(2026, 7, 1, 0, 0, 0);
    const entries = [];

    for (let index = 0; index < 100; index += 1) {
        const number = index + 1;
        const suffix = String(number).padStart(3, '0');
        const identity = identities[index % identities.length];
        const randomPassword = `Aa1${createSessionToken().slice(0, 13)}`;
        const passwordRecord = await createPasswordRecord(randomPassword);
        entries.push(createSeedEntry({
            number,
            seedBatch: DASHBOARD_SEED_BATCH,
            account: `dashboard-seed-${suffix}`,
            passwordRecord,
            name: `${familyNames[index % familyNames.length]}${givenNames[Math.floor(index / 10)]}`,
            email: `attendee${suffix}@example.com`,
            phone: `0900${String(number).padStart(6, '0')}`,
            identity,
            company: index % 5 === 0 ? '' : `示例公司${(index % 12) + 1}`,
            department: index % 4 === 0 ? '' : ['工程部', '設計部', '行銷部'][index % 3],
            jobTitle: index % 6 === 0 ? '' : ['工程師', '設計師', '專案經理'][index % 3],
            interests: interests[index % interests.length],
            createdAt: baseTime + index * 60 * 60 * 1000
        }));
    }

    dao.replaceSeedBatch(DASHBOARD_SEED_BATCH, entries);
    return entries.length;
}

export async function seedTestMembers({ dao, password }) {
    if (!isValidPassword(password)) {
        throw new Error('FLOWFORM_TEST_MEMBER_PASSWORD 必須為 8～20 字元，並包含大小寫英文字母與數字');
    }
    const memberData = [
        {
            account: TEST_MEMBER_ACCOUNTS[0],
            name: '測試會員一',
            email: 'member01@example.com',
            identity: 'developer'
        },
        {
            account: TEST_MEMBER_ACCOUNTS[1],
            name: '測試會員二',
            email: 'member02@example.com',
            identity: 'student'
        }
    ];
    const entries = [];
    for (let index = 0; index < memberData.length; index += 1) {
        const data = memberData[index];
        const passwordRecord = await createPasswordRecord(password);
        entries.push(createSeedEntry({
            number: index + 1,
            seedBatch: TEST_MEMBER_SEED_BATCH,
            account: data.account,
            passwordRecord,
            name: data.name,
            email: data.email,
            phone: `091100000${index + 1}`,
            identity: data.identity,
            company: index === 0 ? '測試公司' : '',
            department: index === 0 ? '前端部門' : '',
            jobTitle: index === 0 ? '測試工程師' : '',
            interests: index === 0 ? ['JavaScript', 'Vue'] : [],
            createdAt: Date.UTC(2026, 7, 10 + index, 9, 0, 0)
        }));
    }
    dao.replaceSeedBatch(TEST_MEMBER_SEED_BATCH, entries);
    return entries.length;
}
