import {
    clearedSessionCookie,
    getSessionToken,
    sessionCookie
} from './auth.js';
import { ApiError } from './errors.js';
import { createRegistrationService } from './service.js';

const json = (status, body, headers = {}) => ({ status, body, headers });
const noStoreHeaders = { 'Cache-Control': 'no-store' };
const noStorePaths = new Set([
    '/api/login',
    '/api/logout',
    '/api/auth/me',
    '/api/registrations'
]);

export function createApiController({ dao, secureCookie, now }) {
    const service = createRegistrationService({ dao, now });

    return async function handle(request) {
        try {
            const { method, path, body = {}, cookieHeader = '' } = request;
            const token = getSessionToken(cookieHeader);

            if (method === 'GET' && path === '/api/health') {
                return json(200, { status: 'ok' });
            }
            if (method === 'POST' && path === '/api/check-account') {
                return json(200, await service.checkAccount(body.account));
            }
            if (method === 'POST' && path === '/api/registrations') {
                return json(201, await service.register(body));
            }
            if (method === 'POST' && path === '/api/login') {
                const result = await service.login(body);
                return json(200, result.body, {
                    ...noStoreHeaders,
                    'Set-Cookie': sessionCookie(result.token, { secure: secureCookie })
                });
            }
            if (method === 'POST' && path === '/api/logout') {
                await service.logout(token);
                return { status: 204, body: null, headers: {
                    ...noStoreHeaders,
                    'Set-Cookie': clearedSessionCookie({ secure: secureCookie })
                } };
            }
            if (method === 'GET' && path === '/api/auth/me') {
                return json(200, await service.getCurrentUser(token), noStoreHeaders);
            }
            if (method === 'GET' && path === '/api/registrations') {
                return json(200, await service.getRegistrations(token), noStoreHeaders);
            }
            return json(404, { message: 'API route not found', code: 'NOT_FOUND' });
        } catch (error) {
            if (error instanceof ApiError) {
                const body = { message: error.message, code: error.code };
                if (error.details) body.errors = error.details;
                const headers = noStorePaths.has(request.path) ? noStoreHeaders : {};
                return json(error.status, body, headers);
            }
            throw error;
        }
    };
}
