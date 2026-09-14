import { createSqliteDao } from '../express/sqliteDao.js';
import { getDatabaseFile, requiredEnvironmentVariable } from './config.js';
import { createOrUpdateAdmin } from './provisioning.js';

const dao = createSqliteDao(getDatabaseFile());
try {
    await createOrUpdateAdmin({
        dao,
        account: requiredEnvironmentVariable('FLOWFORM_ADMIN_ACCOUNT'),
        password: requiredEnvironmentVariable('FLOWFORM_ADMIN_PASSWORD')
    });
    console.log('管理員帳號已建立或更新。');
} finally {
    dao.close();
}
