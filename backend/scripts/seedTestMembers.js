import { createSqliteDao } from '../express/sqliteDao.js';
import { getDatabaseFile, requiredEnvironmentVariable } from './config.js';
import { seedTestMembers } from './provisioning.js';

const dao = createSqliteDao(getDatabaseFile());
try {
    const count = await seedTestMembers({
        dao,
        password: requiredEnvironmentVariable('FLOWFORM_TEST_MEMBER_PASSWORD')
    });
    console.log(`測試會員 seed 已建立：${count} 筆。`);
} finally {
    dao.close();
}
