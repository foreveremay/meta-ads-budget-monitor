import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export async function initializeAdmin() {
    const existingAdmin = await prisma.admin.findFirst();

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.admin.create({
            data: {
                username: 'admin',
                password: hashedPassword
            }
        });
        console.log('[系統] 已建立預設管理員帳號 (username: admin, password: admin123)');
    }
}
