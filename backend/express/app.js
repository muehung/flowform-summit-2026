import cors from 'cors';
import express from 'express';
import { createApiController } from '../shared/controller.js';

function asyncHandler(handler) {
    return (request, response, next) => {
        Promise.resolve(handler(request, response, next)).catch(next);
    };
}

export function createExpressApp({ dao }) {
    const app = express();
    const controller = createApiController({
        dao,
        secureCookie: process.env.NODE_ENV === 'production'
    });

    app.use(cors());
    app.use(express.json());
    app.all('/api/*path', asyncHandler(async (request, response) => {
        const result = await controller({
            method: request.method,
            path: request.path,
            body: request.body,
            cookieHeader: request.headers.cookie
        });
        for (const [name, value] of Object.entries(result.headers)) {
            response.setHeader(name, value);
        }
        if (result.body === null) return response.status(result.status).send();
        return response.status(result.status).json(result.body);
    }));

    app.use((error, request, response, next) => {
        if (response.headersSent) return next(error);
        if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
            return response.status(400).json({
                message: 'JSON 格式不正確',
                code: 'INVALID_JSON'
            });
        }
        console.error(`後端發生非預期錯誤：${request.method} ${request.originalUrl}`, error.message);
        return response.status(500).json({
            message: '系統暫時無法處理請求，請稍後再試',
            code: 'INTERNAL_SERVER_ERROR'
        });
    });

    return app;
}
