import { createSqliteDao } from '../express/sqliteDao.js';
import { getDatabaseFile } from './config.js';
import { seedDashboard } from './provisioning.js';

const dao = createSqliteDao(getDatabaseFile());
try {
    const count = await seedDashboard({ dao });
    console.log(`Dashboard seed 已建立：${count} 筆。`);
} finally {
    dao.close();
}
