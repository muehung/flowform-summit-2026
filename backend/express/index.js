import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createExpressApp } from './app.js';
import { createSqliteDao } from './sqliteDao.js';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const databaseFile = path.resolve(currentDirectory, '../data/index.db');
const port = Number(process.env.PORT ?? 3000);
const dao = createSqliteDao(databaseFile);
const app = createExpressApp({ dao });

const server = app.listen(port, () => {
    console.log(`SQLite 測試後端伺服器已啟動：http://localhost:${port}`);
});

function shutdown() {
    server.close(() => {
        dao.close();
        process.exit(0);
    });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
