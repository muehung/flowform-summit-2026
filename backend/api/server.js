// 改為 ES Module 語法
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors()); // 允許跨來源請求 (CORS)
app.use(express.json()); // 解析 JSON body

// 模擬已存在於資料庫的帳號清單 📋
const existingAccounts = ['admin', 'test', 'flowform', 'user123'];

app.post('/api/check-account', (req, res) => {
    const { account } = req.body;
    console.log(`收到帳號檢查請求: ${account}`);

    // 檢查帳號是否已經存在
    const isTaken = existingAccounts.includes(account);

    // 模擬 1 秒的網路延遲效果 ⏳
    setTimeout(() => {
        res.json({
            account: account,
            available: !isTaken // 如果沒被採納，即為可用 (available)
        });
    }, 1000);
});

app.listen(3000, () => {
    console.log('🚀 測試後端伺服器已啟動: http://localhost:3000');
});