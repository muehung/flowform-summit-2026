import assert from 'node:assert/strict';
import test from 'node:test';
import { createExpressApp } from '../express/app.js';
import {
    createOrUpdateAdmin,
    seedTestMembers
} from '../scripts/provisioning.js';
import {
    ADMIN_PASSWORD,
    createTestContext,
    MEMBER_PASSWORD
} from './helpers.js';

test('Express HTTP smoke：login → auth/me → registrations → logout', async () => {
    const context = createTestContext();
    const app = createExpressApp({ dao: context.dao });
    let server;
    try {
        await createOrUpdateAdmin({
            dao: context.dao,
            account: 'smoke-admin',
            password: ADMIN_PASSWORD
        });
        await seedTestMembers({ dao: context.dao, password: MEMBER_PASSWORD });
        server = await new Promise((resolve) => {
            const listener = app.listen(0, '127.0.0.1', () => resolve(listener));
        });
        const { port } = server.address();
        const baseUrl = `http://127.0.0.1:${port}`;

        const healthResponse = await fetch(`${baseUrl}/api/health`);
        assert.equal(healthResponse.status, 200);

        const loginResponse = await fetch(`${baseUrl}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                account: 'smoke-admin',
                password: ADMIN_PASSWORD
            })
        });
        assert.equal(loginResponse.status, 200);
        const cookie = loginResponse.headers.get('set-cookie').split(';')[0];

        const meResponse = await fetch(`${baseUrl}/api/auth/me`, {
            headers: { Cookie: cookie }
        });
        assert.equal(meResponse.status, 200);
        assert.equal((await meResponse.json()).user.role, 'admin');

        const listResponse = await fetch(`${baseUrl}/api/registrations`, {
            headers: { Cookie: cookie }
        });
        assert.equal(listResponse.status, 200);
        assert.equal((await listResponse.json()).registrations.length, 2);

        const logoutResponse = await fetch(`${baseUrl}/api/logout`, {
            method: 'POST',
            headers: { Cookie: cookie }
        });
        assert.equal(logoutResponse.status, 204);

        const afterLogoutResponse = await fetch(`${baseUrl}/api/registrations`, {
            headers: { Cookie: cookie }
        });
        assert.equal(afterLogoutResponse.status, 401);
    } finally {
        if (server?.listening) {
            await new Promise((resolve, reject) => {
                server.close((error) => error ? reject(error) : resolve());
            });
        }
        context.close();
    }
});
