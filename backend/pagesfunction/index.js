/*
 * Pages Advanced Mode 的 Worker entry。
 *
 * /api/* 使用 D1 adapter；其他請求交給 Pages 靜態資產。
 */
import { handleApiRequest } from './api.js';

async function fetchAsset(request, env) {
    if (!env?.ASSETS) {
        return new Response('Static asset binding is not configured', {
            status: 503
        });
    }

    const assetResponse = await env.ASSETS.fetch(request);

    if (assetResponse.status !== 404) {
        return assetResponse;
    }

    const fallbackUrl = new URL('/index.html', request.url);
    return env.ASSETS.fetch(new Request(fallbackUrl, request));
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname.startsWith('/api/')) {
            return handleApiRequest(request, env);
        }

        return fetchAsset(request, env);
    }
};
