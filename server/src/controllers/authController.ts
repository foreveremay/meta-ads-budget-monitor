import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma';
import { generateToken } from '../middleware/auth';

export class AuthController {
    static async login(req: Request, res: Response) {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: '請提供使用者名稱與密碼' });
        }

        const admin = await prisma.admin.findUnique({
            where: { username }
        });

        if (!admin) {
            return res.status(401).json({ error: '使用者名稱或密碼錯誤' });
        }

        const isValidPassword = await bcrypt.compare(password, admin.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: '使用者名稱或密碼錯誤' });
        }

        const token = generateToken(admin.id);

        res.json({
            token,
            user: {
                id: admin.id,
                username: admin.username
            }
        });
    }

    static async verify(req: Request, res: Response) {
        // 如果能到這裡，代表 token 有效（已通過 middleware）
        res.json({ valid: true });
    }
}
