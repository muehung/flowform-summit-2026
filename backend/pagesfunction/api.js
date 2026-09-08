import { createApiController } from '../shared/controller.js';
import { createD1Dao } from './d1Dao.js';

export async function handleApiRequest(request, env) {
    const path = new URL(request.url).pathname;
    if (!env.DB && path !== '/api/health') {
        return Response.json({
            message: 'D1 binding 尚未設定',
            code: 'DATABASE_NOT_CONFIGURED'
        }, { status: 503 });
    }

    let body = {};
    const routesWithJsonBody = new Set([
        '/api/check-account',
        '/api/registrations',
        '/api/login'
    ]);
    if (request.method === 'POST' && routesWithJsonBody.has(path)) {
        try {
            body = await request.json();
        } catch {
            return Response.json({
                message: 'JSON 格式不正確',
                code: 'INVALID_JSON'
            }, { status: 400 });
        }
    }

    try {
        const controller = createApiController({
            dao: env.DB ? createD1Dao(env.DB) : null,
            secureCookie: true
        });
        const result = await controller({
            method: request.method,
            path,
            body,
            cookieHeader: request.headers.get('Cookie')
        });
        if (result.body === null) {
            return new Response(null, {
                status: result.status,
                headers: result.headers
            });
        }
        return Response.json(result.body, {
            status: result.status,
            headers: result.headers
        });
    } catch (error) {
        console.error('Pages Worker API error:', error.message);
        return Response.json({
            message: '系統暫時無法處理請求，請稍後再試',
            code: 'INTERNAL_SERVER_ERROR'
        }, { status: 500 });
    }
}
