import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

export class SettingsController {
    static async getAll(req: AuthRequest, res: Response) {
        const settings = await prisma.systemSetting.findMany();

        // 轉換為 key-value 物件
        const settingsObj: Record<string, string> = {};
        settings.forEach(s => {
            settingsObj[s.key] = s.value;
        });

        res.json(settingsObj);
    }

    static async update(req: AuthRequest, res: Response) {
        const updates = req.body; // { META_ACCESS_TOKEN: 'xxx', LINE_CHANNEL_TOKEN: 'yyy' }

        for (const [key, value] of Object.entries(updates)) {
            await prisma.systemSetting.upsert({
                where: { key },
                update: { value: value as string },
                create: { key, value: value as string }
            });
        }

        res.json({ success: true, message: '設定已更新' });
    }
}
