import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import apiRoutes from './routes/api';
import { MonitorService } from './services/monitorService';
import { initializeAdmin } from './utils/initAdmin';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

// Schedule job: Run every hour (for MVP, maybe every minute for demo?)
// '*/1 * * * *' = every minute
cron.schedule('*/1 * * * *', () => {
    console.log('執行排程檢查...');
    MonitorService.checkAllAccounts();
});

// 初始化並啟動伺服器
async function startServer() {
    await initializeAdmin();

    app.listen(PORT, () => {
        console.log(`伺服器運行於 http://localhost:${PORT}`);
    });
}

startServer();
