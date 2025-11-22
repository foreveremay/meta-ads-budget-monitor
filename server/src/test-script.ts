import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

async function test() {
    try {
        console.log('1. Creating Client...');
        const clientRes = await axios.post(`${API_URL}/clients`, { name: 'Test Client' });
        const client = clientRes.data;
        console.log('Client created:', client.id);

        console.log('2. Adding LINE Group...');
        await axios.post(`${API_URL}/clients/${client.id}/line-groups`, {
            groupId: 'C1234567890',
            name: 'Test Group'
        });
        console.log('LINE Group added.');

        console.log('3. Adding Ad Account (High Spend)...');
        // Account ID ending in '9' triggers the mock high spend (950/1000)
        await axios.post(`${API_URL}/ad-accounts`, {
            clientId: client.id,
            accountId: 'act_999999999',
            name: 'High Spend Account',
            budgetLimit: 1000,
            thresholdPercent: 20
        });
        console.log('Ad Account added.');

        console.log('4. Triggering Monitor Check...');
        await axios.post(`${API_URL}/monitor/check`);
        console.log('Monitor check triggered.');

        console.log('5. Verifying Notification Log...');
        // We can't easily check logs via API unless we add an endpoint, 
        // but we can check the server logs in the terminal output.
        console.log('Done! Check server logs for "Pushed message to group C1234567890"');

    } catch (error) {
        console.error('Test failed:', error);
    }
}

test();
