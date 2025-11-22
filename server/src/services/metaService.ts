import { AdAccount } from '@prisma/client';

export interface AccountInsights {
    spend: number;
    currency: string;
}

export class MetaService {
    // In a real app, this would use the Access Token to fetch data from Meta Graph API
    // For MVP, we mock this.

    static async getAccountInsights(accountId: string): Promise<AccountInsights> {
        console.log(`[MetaService] 獲取帳號洞察數據: ${accountId}`);

        // Simulate API latency
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock logic: 
        // If accountId ends with '9', return high spend (near limit)
        // Otherwise return random spend

        if (accountId.endsWith('9')) {
            return {
                spend: 950.0, // Assume limit is 1000, so 95% used
                currency: 'TWD'
            };
        }

        return {
            spend: Math.floor(Math.random() * 500), // Random spend 0-500
            currency: 'TWD'
        };
    }

    static async validateToken(token: string): Promise<boolean> {
        // Mock validation
        return token.length > 0;
    }
}
