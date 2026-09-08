import {
    SESSION_TTL_MS,
    createPasswordRecord,
    createSessionToken,
    hashSessionToken,
    runDummyPasswordCheck,
    verifyPassword
} from './auth.js';
import { ApiError } from './errors.js';
import {
    existingAccounts,
    getRegistrationType,
    normalizeAccount,
    validateRegistration
} from './validation.js';

function publicUser(user, registration) {
    return {
        registrationId: registration?.registrationId,
        account: user.account,
        name: registration?.name,
        registrationType: registration?.registrationType,
        role: user.role
    };
}

export function createRegistrationService({ dao, now = Date.now }) {
    async function cleanup() {
        await dao.cleanupExpired(now());
    }

    async function authenticate(token) {
        if (!token) return null;
        await cleanup();
        return dao.findAuthenticatedUserByTokenHash(
            await hashSessionToken(token),
            now()
        );
    }

    return {
        async checkAccount(accountInput) {
            if (typeof accountInput !== 'string' || !accountInput.trim()) {
                throw new ApiError(400, 'INVALID_ACCOUNT', '請提供要檢查的帳號');
            }
            await cleanup();
            const account = normalizeAccount(accountInput);
            const user = await dao.findUserByAccount(account);
            const available = !existingAccounts.includes(account) && !user;
            return {
                message: available ? '此帳號可以使用' : '此帳號已被使用',
                account,
                available
            };
        },

        async register(data) {
            const errors = validateRegistration(data);
            if (Object.keys(errors).length) {
                throw new ApiError(400, 'VALIDATION_ERROR', '報名資料格式不正確', errors);
            }
            await cleanup();
            const account = normalizeAccount(data.account);
            if (existingAccounts.includes(account)) {
                throw new ApiError(409, 'ACCOUNT_TAKEN', '此帳號已被使用，請返回上一步更換帳號');
            }

            const createdAt = now();
            const expiresAt = createdAt + SESSION_TTL_MS;
            const userId = crypto.randomUUID();
            const registrationId = crypto.randomUUID();
            const password = await createPasswordRecord(data.password);
            try {
                await dao.createUserWithRegistration({
                    user: {
                        id: userId,
                        account,
                        passwordAlgorithm: password.algorithm,
                        passwordIterations: password.iterations,
                        passwordSalt: password.salt,
                        passwordHash: password.hash,
                        role: 'user',
                        createdAt,
                        expiresAt
                    },
                    registration: {
                        id: registrationId,
                        userId,
                        status: 'registered',
                        registrationType: getRegistrationType(data.identity),
                        name: data.name.trim(),
                        email: data.email.trim(),
                        phone: data.phone.trim(),
                        identity: data.identity,
                        company: data.company?.trim() ?? '',
                        department: data.department?.trim() ?? '',
                        jobTitle: data.jobTitle?.trim() ?? '',
                        interestsJson: JSON.stringify(data.interests ?? []),
                        createdAt,
                        expiresAt
                    }
                });
            } catch (error) {
                if (error.code === 'ACCOUNT_TAKEN') {
                    throw new ApiError(409, 'ACCOUNT_TAKEN', '此帳號已被使用，請返回上一步更換帳號');
                }
                throw error;
            }
            return {
                message: '報名成功',
                registration: {
                    registrationId,
                    status: 'registered',
                    name: data.name.trim(),
                    email: data.email.trim(),
                    registrationType: getRegistrationType(data.identity)
                }
            };
        },

        async login({ account: accountInput, password }) {
            if (typeof accountInput !== 'string' || !accountInput.trim() || typeof password !== 'string' || !password) {
                throw new ApiError(400, 'INVALID_LOGIN_DATA', '請輸入帳號與密碼');
            }
            await cleanup();
            const user = await dao.findUserByAccount(normalizeAccount(accountInput));
            const matched = user
                ? await verifyPassword(password, user)
                : await runDummyPasswordCheck(password);
            if (!user || !matched) {
                throw new ApiError(401, 'INVALID_CREDENTIALS', '帳號或密碼錯誤');
            }
            const token = createSessionToken();
            const createdAt = now();
            await dao.createSession({
                id: crypto.randomUUID(),
                userId: user.id,
                tokenHash: await hashSessionToken(token),
                createdAt,
                expiresAt: createdAt + SESSION_TTL_MS
            });
            const registration = await dao.findRegistrationByUserId(user.id);
            return { token, body: { message: '登入成功', user: publicUser(user, registration) } };
        },

        async logout(token) {
            if (token) await dao.revokeSession(await hashSessionToken(token), now());
        },

        async getCurrentUser(token) {
            const user = await authenticate(token);
            if (!user) throw new ApiError(401, 'UNAUTHENTICATED', '尚未登入');
            const registration = await dao.findRegistrationByUserId(user.id);
            return { user: publicUser(user, registration) };
        },

        async getMyRegistration(token) {
            const user = await authenticate(token);
            if (!user) throw new ApiError(401, 'UNAUTHENTICATED', '尚未登入');
            return { registration: await dao.findRegistrationByUserId(user.id) };
        }
    };
}
