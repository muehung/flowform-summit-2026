export const SESSION_TTL_MS = 30 * 60 * 1000;
export const PBKDF2_ITERATIONS = 100000;
const DERIVED_KEY_LENGTH_BITS = 256;
const PASSWORD_SALT_LENGTH_BYTES = 16;
const SESSION_COOKIE_NAME = 'flowform_session';
const textEncoder = new TextEncoder();

function toBase64(bytes) {
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
}

function fromBase64(value) {
    return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

function toBase64Url(bytes) {
    return toBase64(bytes)
        .replaceAll('+', '-')
        .replaceAll('/', '_')
        .replaceAll('=', '');
}

function constantTimeEqual(left, right) {
    if (left.length !== right.length) return false;
    let difference = 0;
    for (let index = 0; index < left.length; index += 1) {
        difference |= left[index] ^ right[index];
    }
    return difference === 0;
}

export async function derivePasswordHash(
    password,
    salt,
    iterations = PBKDF2_ITERATIONS
) {
    const passwordKey = await crypto.subtle.importKey(
        'raw', textEncoder.encode(password), 'PBKDF2', false, ['deriveBits']
    );
    const bits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt,
            iterations,
            hash: 'SHA-256'
        },
        passwordKey,
        DERIVED_KEY_LENGTH_BITS
    );
    return new Uint8Array(bits);
}

export async function createPasswordRecord(password) {
    const salt = crypto.getRandomValues(new Uint8Array(PASSWORD_SALT_LENGTH_BYTES));
    const hash = await derivePasswordHash(password, salt);
    return {
        algorithm: 'PBKDF2-HMAC-SHA-256',
        iterations: PBKDF2_ITERATIONS,
        salt: toBase64(salt),
        hash: toBase64(hash)
    };
}

export async function verifyPassword(password, user) {
    const derivedHash = await derivePasswordHash(
        password,
        fromBase64(user.password_salt),
        user.password_iterations
    );
    return constantTimeEqual(derivedHash, fromBase64(user.password_hash));
}

export function createSessionToken() {
    return toBase64Url(crypto.getRandomValues(new Uint8Array(32)));
}

export async function runDummyPasswordCheck(password) {
    return verifyPassword(password, {
        password_salt: toBase64(new Uint8Array(PASSWORD_SALT_LENGTH_BYTES)),
        password_hash: toBase64(new Uint8Array(DERIVED_KEY_LENGTH_BITS / 8))
    });
}

export async function hashSessionToken(token) {
    const bytes = await crypto.subtle.digest('SHA-256', textEncoder.encode(token));
    return toBase64Url(new Uint8Array(bytes));
}

export function getSessionToken(cookieHeader = '') {
    for (const cookie of (cookieHeader ?? '').split(';')) {
        const [name, ...valueParts] = cookie.trim().split('=');
        if (name === SESSION_COOKIE_NAME) return valueParts.join('=');
    }
    return null;
}

export function sessionCookie(token, { secure = true } = {}) {
    const securePart = secure ? '; Secure' : '';
    return `${SESSION_COOKIE_NAME}=${token}; HttpOnly${securePart}; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL_MS / 1000}`;
}

export function clearedSessionCookie({ secure = true } = {}) {
    const securePart = secure ? '; Secure' : '';
    return `${SESSION_COOKIE_NAME}=; HttpOnly${securePart}; SameSite=Lax; Path=/; Max-Age=0`;
}
