import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export class AdAccountController {
    static async create(req: Request, res: Response) {
        const { clientId, accountId, name, budgetLimit, thresholdPercent } = req.body;

        const account = await prisma.adAccount.create({
            data: {
                clientId,
                accountId,
                name,
                budgetLimit: parseFloat(budgetLimit),
                thresholdPercent: parseFloat(thresholdPercent || '20'),
                currentSpend: 0 // Initial
            }
        });
        res.json(account);
    }

    static async delete(req: Request, res: Response) {
        const { id } = req.params;
        await prisma.adAccount.delete({ where: { id } });
        res.json({ success: true });
    }

    static async update(req: Request, res: Response) {
        const { id } = req.params;
        const data = req.body;
        const account = await prisma.adAccount.update({
            where: { id },
            data
        });
        res.json(account);
    }
}
