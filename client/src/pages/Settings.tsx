import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Save } from 'lucide-react';

export const Settings: React.FC = () => {
    const [settings, setSettings] = useState({
        META_ACCESS_TOKEN: '',
        LINE_CHANNEL_TOKEN: '',
        CRON_SCHEDULE: '*/1 * * * *'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/settings');
            setSettings({ ...settings, ...res.data });
        } catch (error) {
            console.error('獲取設定失敗:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');

        try {
            await api.put('/settings', settings);
            setMessage('設定已成功儲存！');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('儲存失敗，請稍後再試。');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8">載入中...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">系統設定</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meta Access Token
                        </label>
                        <input
                            type="text"
                            value={settings.META_ACCESS_TOKEN}
                            onChange={(e) => setSettings({ ...settings, META_ACCESS_TOKEN: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="輸入 Meta Marketing API Access Token"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            用於獲取廣告帳號數據。目前使用模擬服務，此欄位為未來真實串接預留。
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            LINE Channel Access Token
                        </label>
                        <input
                            type="text"
                            value={settings.LINE_CHANNEL_TOKEN}
                            onChange={(e) => setSettings({ ...settings, LINE_CHANNEL_TOKEN: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="輸入 LINE Messaging API Channel Access Token"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            用於發送 LINE 通知。目前使用模擬服務，此欄位為未來真實串接預留。
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            檢查排程 (Cron 表達式)
                        </label>
                        <input
                            type="text"
                            value={settings.CRON_SCHEDULE}
                            onChange={(e) => setSettings({ ...settings, CRON_SCHEDULE: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="*/1 * * * *"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            預設為每分鐘檢查一次。格式: 分 時 日 月 週
                        </p>
                    </div>

                    {message && (
                        <div className={`px-4 py-3 rounded-lg text-sm ${message.includes('成功')
                                ? 'bg-green-50 border border-green-200 text-green-700'
                                : 'bg-red-50 border border-red-200 text-red-700'
                            }`}>
                            {message}
                        </div>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        <Save size={20} />
                        {saving ? '儲存中...' : '儲存設定'}
                    </button>
                </div>
            </div>
        </div>
    );
};
