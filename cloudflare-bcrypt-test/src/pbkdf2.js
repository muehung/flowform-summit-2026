const PBKDF2_ITERATIONS = 100000;
const DERIVED_KEY_LENGTH_BITS = 256;
const SALT_LENGTH_BYTES = 16;
const TEST_PASSWORD = 'FlowFormPbkdf2Test123';
const VERIFY_TEST_SALT = Uint8Array.from([
    50, 108, 145, 7, 218, 63, 194, 91,
    12, 177, 48, 230, 84, 19, 166, 240
]);
const VERIFY_TEST_HASH_BASE64 =
    '/Iy5eaNJCGeweXjFu7/618ha+LxyjUantepqMsK6NJk=';

async function derivePasswordHash(password, salt) {
    const passwordBytes = new TextEncoder().encode(password);
    const passwordKey = await crypto.subtle.importKey(
        'raw',
        passwordBytes,
        'PBKDF2',
        false,
        ['deriveBits']
    );

    return crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt,
            iterations: PBKDF2_ITERATIONS,
            hash: 'SHA-256'
        },
        passwordKey,
        DERIVED_KEY_LENGTH_BITS
    );
}

function decodeBase64(value) {
    return Uint8Array.from(
        atob(value),
        (character) => character.charCodeAt(0)
    );
}

function constantTimeEqual(left, right) {
    if (left.length !== right.length) {
        return false;
    }

    let difference = 0;

    for (let index = 0; index < left.length; index += 1) {
        difference |= left[index] ^ right[index];
    }

    return difference === 0;
}

function createResult(mode, matched) {
    return {
        event: 'pbkdf2-hmac-sha256-benchmark',
        mode,
        iterations: PBKDF2_ITERATIONS,
        saltLengthBytes: SALT_LENGTH_BYTES,
        derivedKeyLengthBits: DERIVED_KEY_LENGTH_BITS,
        matched
    };
}

export default {
    async fetch(request) {
        const url = new URL(request.url);

        if (request.method !== 'POST') {
            return Response.json(
                {
                    message: 'Send POST /benchmark/hash or POST /benchmark/verify.'
                },
                { status: 404 }
            );
        }

        if (url.pathname === '/benchmark/hash') {
            const salt = crypto.getRandomValues(
                new Uint8Array(SALT_LENGTH_BYTES)
            );
            await derivePasswordHash(TEST_PASSWORD, salt);

            const result = createResult('hash', true);
            console.log(JSON.stringify(result));

            return Response.json(result);
        }

        if (url.pathname === '/benchmark/verify') {
            const derivedHash = new Uint8Array(
                await derivePasswordHash(
                    TEST_PASSWORD,
                    VERIFY_TEST_SALT
                )
            );
            const expectedHash = decodeBase64(
                VERIFY_TEST_HASH_BASE64
            );
            const matched = constantTimeEqual(
                derivedHash,
                expectedHash
            );
            const result = createResult('verify', matched);

            console.log(JSON.stringify(result));

            return Response.json(result);
        }

        return Response.json(
            {
                message: 'Send POST /benchmark/hash or POST /benchmark/verify.'
            },
            { status: 404 }
        );
    }
};
