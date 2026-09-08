import bcrypt from 'bcryptjs';

const TEST_PASSWORD = 'FlowFormBcryptTest123';
const BCRYPT_COST = 10;

export default {
    async fetch(request) {
        const url = new URL(request.url);

        if (
            request.method !== 'POST' ||
            url.pathname !== '/benchmark'
        ) {
            return Response.json(
                {
                    message: 'Send POST /benchmark to run the bcrypt test.'
                },
                { status: 404 }
            );
        }

        const startedAt = performance.now();
        const passwordHash = await bcrypt.hash(
            TEST_PASSWORD,
            BCRYPT_COST
        );
        const hashedAt = performance.now();
        const matched = await bcrypt.compare(
            TEST_PASSWORD,
            passwordHash
        );
        const finishedAt = performance.now();

        const result = {
            event: 'bcrypt-cost-10-benchmark',
            cost: BCRYPT_COST,
            matched,
            hashDurationMs: Math.round(hashedAt - startedAt),
            compareDurationMs: Math.round(finishedAt - hashedAt),
            totalDurationMs: Math.round(finishedAt - startedAt)
        };

        console.log(JSON.stringify(result));

        return Response.json(result);
    }
};
