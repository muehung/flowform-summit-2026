import path from 'node:path';
import { fileURLToPath } from 'node:url';

const backendDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..'
);

export function getDatabaseFile() {
    return process.env.FLOWFORM_DATABASE_FILE ||
        path.join(backendDirectory, 'data', 'index.db');
}

export function requiredEnvironmentVariable(name) {
    const value = process.env[name];
    if (!value) throw new Error(`缺少必要環境變數：${name}`);
    return value;
}
