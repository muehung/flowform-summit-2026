import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createSqliteDao } from '../express/sqliteDao.js';
import { createApiController } from '../shared/controller.js';

function randomValidPassword() {
    return `Aa1${crypto.randomUUID().replaceAll('-', '').slice(0, 13)}`;
}

export const ADMIN_PASSWORD = randomValidPassword();
export const MEMBER_PASSWORD = randomValidPassword();

export function createTestContext(initialNow = Date.UTC(2026, 8, 14, 0, 0, 0)) {
    const directory = mkdtempSync(path.join(tmpdir(), 'flowform-test-'));
    const databaseFile = path.join(directory, 'test.db');
    const dao = createSqliteDao(databaseFile);
    let currentNow = initialNow;
    const controller = createApiController({
        dao,
        secureCookie: false,
        now: () => currentNow
    });

    return {
        dao,
        controller,
        databaseFile,
        get now() {
            return currentNow;
        },
        set now(value) {
            currentNow = value;
        },
        close() {
            dao.close();
            rmSync(directory, { recursive: true, force: true });
        }
    };
}

export async function request(controller, method, path, options = {}) {
    return controller({
        method,
        path,
        body: options.body ?? {},
        cookieHeader: options.cookie ?? ''
    });
}

export async function login(controller, account, password) {
    const response = await request(controller, 'POST', '/api/login', {
        body: { account, password }
    });
    const cookie = response.headers['Set-Cookie']?.split(';')[0];
    return { response, cookie };
}

export function validRegistration(overrides = {}) {
    return {
        name: '一般會員',
        email: 'regular@example.com',
        phone: '0912345678',
        identity: 'developer',
        company: '',
        department: '',
        jobTitle: '',
        interests: [],
        account: 'regular-member',
        password: 'Regular123',
        ...overrides
    };
}
