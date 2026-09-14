import { createSqliteDao } from '../express/sqliteDao.js';
import { getDatabaseFile } from './config.js';
import { DASHBOARD_SEED_BATCH } from './provisioning.js';

const dao = createSqliteDao(getDatabaseFile());
try {
    const count = dao.resetSeedBatch(DASHBOARD_SEED_BATCH);
    console.log(`Dashboard seed 已重設：移除 ${count} 個 seed user 及其報名資料。`);
} finally {
    dao.close();
}
