import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export class ClientController {
    static async getAll(req: Request, res: Response) {
        const clients = await prisma.client.findMany({
            include: { adAccounts: true, lineGroups: true }
        });
        res.json(clients);
    }

    static async create(req: Request, res: Response) {
        const { name } = req.body;
        const client = await prisma.client.create({
            data: { name }
        });
        res.json(client);
    }

    static async delete(req: Request, res: Response) {
        const { id } = req.params;
        await prisma.client.delete({ where: { id } });
        res.json({ success: true });
    }

    static async addLineGroup(req: Request, res: Response) {
        const { clientId } = req.params;
        const { groupId, name } = req.body;

        const group = await prisma.lineGroup.create({
            data: {
                groupId,
                name,
                clientId
            }
        });
        res.json(group);
    }
}
