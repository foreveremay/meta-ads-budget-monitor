import { prisma } from '../utils/prisma';
import { MetaService } from './metaService';
import { LineService } from './lineService';

export class MonitorService {
    static async checkAllAccounts() {
        console.log('[MonitorService] 開始檢查...');

        const accounts = await prisma.adAccount.findMany({
            where: { isActive: true },
            include: { client: { include: { lineGroups: true } } }
        });

        for (const account of accounts) {
            try {
                const insights = await MetaService.getAccountInsights(account.accountId);

                // Update current spend in DB
                await prisma.adAccount.update({
                    where: { id: account.id },
                    data: { currentSpend: insights.spend }
                });

                const remaining = account.budgetLimit - insights.spend;
                const remainingPercent = (remaining / account.budgetLimit) * 100;

                console.log(`[MonitorService] 帳號 ${account.name} (${account.accountId}): 花費 ${insights.spend}/${account.budgetLimit} (剩餘 ${remainingPercent.toFixed(1)}%)`);

                if (remainingPercent <= account.thresholdPercent) {
                    // Check if we should alert (e.g., avoid spamming? For MVP, just alert)
                    // In a real app, we'd check NotificationLog to see if we already sent an alert today.

                    const message = `⚠️ 廣告額度警示 ⚠️\n\n客戶: ${account.client.name}\n帳號: ${account.name}\n目前花費: ${insights.spend}\n預算上限: ${account.budgetLimit}\n剩餘額度: ${remaining} (${remainingPercent.toFixed(1)}%)`;

                    // Send to all linked LINE groups
                    for (const group of account.client.lineGroups) {
                        await LineService.pushMessage(group.groupId, message);
                    }

                    // Log notification
                    await prisma.notificationLog.create({
                        data: {
                            message,
                            adAccountId: account.id
                        }
                    });
                }

            } catch (error) {
                console.error(`[MonitorService] Error checking account ${account.id}:`, error);
            }
        }
        console.log('[MonitorService] 檢查完成。');
    }
}
