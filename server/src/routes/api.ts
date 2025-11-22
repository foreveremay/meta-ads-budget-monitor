import { Router } from 'express';
import { ClientController } from '../controllers/clientController';
import { AdAccountController } from '../controllers/adAccountController';
import { AuthController } from '../controllers/authController';
import { SettingsController } from '../controllers/settingsController';
import { MonitorService } from '../services/monitorService';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// 公開路由 (不需驗證)
router.post('/auth/login', AuthController.login);

// 受保護路由 (需要驗證)
router.get('/auth/verify', authMiddleware, AuthController.verify);

// Clients
router.get('/clients', authMiddleware, ClientController.getAll);
router.post('/clients', authMiddleware, ClientController.create);
router.delete('/clients/:id', authMiddleware, ClientController.delete);
router.post('/clients/:clientId/line-groups', authMiddleware, ClientController.addLineGroup);

// Ad Accounts
router.post('/ad-accounts', authMiddleware, AdAccountController.create);
router.delete('/ad-accounts/:id', authMiddleware, AdAccountController.delete);
router.put('/ad-accounts/:id', authMiddleware, AdAccountController.update);

// Settings
router.get('/settings', authMiddleware, SettingsController.getAll);
router.put('/settings', authMiddleware, SettingsController.update);

// Manual Trigger for testing
router.post('/monitor/check', authMiddleware, async (req, res) => {
    await MonitorService.checkAllAccounts();
    res.json({ success: true, message: '檢查已觸發' });
});

export default router;
