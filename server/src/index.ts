import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import path from 'path';
import apiRoutes from './routes/api';
import { MonitorService } from './services/monitorService';
import { initializeAdmin } from './utils/initAdmin';

// Global error handlers
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Serve static files from the React app
// Assuming the client build output is at ../../client/dist relative to this file (dist/index.js)
// In Docker, we will ensure this structure exists
import fs from 'fs';

// ...

// Serve static files from the React app
let clientDistPath = path.join(__dirname, '../../client/dist');

// Debug: List files in /app to understand structure
try {
    console.log('Listing /app:');
    fs.readdirSync('/app').forEach(f => console.log(' -', f));
    if (fs.existsSync('/app/client')) {
        console.log('Listing /app/client:');
        fs.readdirSync('/app/client').forEach(f => console.log(' -', f));
    }
} catch (e) {
    console.error('Error listing directories:', e);
}

if (fs.existsSync('/app/client/dist')) {
    clientDistPath = '/app/client/dist';
}

console.log('Client Dist Path:', clientDistPath);
if (fs.existsSync(path.join(clientDistPath, 'index.html'))) {
    console.log('index.html found');
} else {
    console.error('index.html NOT found at', path.join(clientDistPath, 'index.html'));
}

app.use(express.static(clientDistPath));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.use((req, res, next) => {
    // Skip API requests
    if (req.path.startsWith('/api')) {
        return next();
    }

    const indexPath = path.join(clientDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Frontend build not found');
    }
});

// Schedule job: Run every hour (for MVP, maybe every minute for demo?)
// '*/1 * * * *' = every minute
cron.schedule('*/1 * * * *', () => {
    console.log('執行排程檢查...');
    MonitorService.checkAllAccounts();
});

// 初始化並啟動伺服器
async function startServer() {
    try {
        await initializeAdmin();
    } catch (error) {
        console.error('初始化管理員失敗 (可能是資料庫未遷移):', error);
    }

    app.listen(Number(PORT), '0.0.0.0', () => {
        console.log(`伺服器運行於 http://0.0.0.0:${PORT}`);
    });
}

startServer();
