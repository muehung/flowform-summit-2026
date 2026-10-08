import { createSqliteDao } from '../express/sqliteDao.js';
import { getDatabaseFile } from './config.js';
import { TEST_MEMBER_SEED_BATCH } from './provisioning.js';

const dao = createSqliteDao(getDatabaseFile());
try {
    const count = dao.resetSeedBatch(TEST_MEMBER_SEED_BATCH);
    console.log(`測試會員 seed 已重設：移除 ${count} 個 user 及其報名資料。`);
} finally {
    dao.close();
}
