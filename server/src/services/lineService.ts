import axios from 'axios';

export class LineService {
  private static readonly LINE_API_URL = 'https://api.line.me/v2/bot/message/push';
  // In real app, get this from DB or env
  private static readonly CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || 'mock_token';

  static async pushMessage(groupId: string, message: string): Promise<void> {
    console.log(`[LineService] 推送訊息到群組 ${groupId}: ${message}`);

    // In a real app, we would make the actual API call:
    /*
    try {
      await axios.post(
        this.LINE_API_URL,
        {
          to: groupId,
          messages: [{ type: 'text', text: message }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.CHANNEL_ACCESS_TOKEN}`,
          },
        }
      );
    } catch (error) {
      console.error('[LineService] Error sending message:', error);
      throw error;
    }
    */

    // For MVP, just log it
    return Promise.resolve();
  }
}
