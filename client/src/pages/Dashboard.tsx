import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { AlertCircle, TrendingUp, Users as UsersIcon, Bell } from 'lucide-react';

interface AdAccount {
    id: string;
    accountId: string;
    name: string;
    budgetLimit: number;
    currentSpend: number;
    thresholdPercent: number;
    isActive: boolean;
    client: {
        name: string;
    };
}

export const Dashboard: React.FC = () => {
    const [accounts, setAccounts] = useState<AdAccount[]>([]);
    const [stats, setStats] = useState({
        totalClients: 0,
        activeAccounts: 0,
        alerts: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');

            // 獲取所有客戶
            const clientsRes = await api.get('/clients');
            const clients = clientsRes.data;

            // 收集所有廣告帳號
            const allAccounts: AdAccount[] = [];
            clients.forEach((client: any) => {
                client.adAccounts.forEach((account: any) => {
                    allAccounts.push({
                        ...account,
                        client: { name: client.name }
                    });
                });
            });

            // 計算統計數據
            const activeAccounts = allAccounts.filter(a => a.isActive).length;
            const alerts = allAccounts.filter(a => {
                const remaining = a.budgetLimit - a.currentSpend;
                const remainingPercent = (remaining / a.budgetLimit) * 100;
                return remainingPercent <= a.thresholdPercent;
            }).length;

            setAccounts(allAccounts);
            setStats({
                totalClients: clients.length,
                activeAccounts,
                alerts
            });
        } catch (err: any) {
            console.error('獲取數據失敗:', err);
            setError(err.response?.data?.error || '無法載入數據');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (account: AdAccount) => {
        const remaining = account.budgetLimit - account.currentSpend;
        const remainingPercent = (remaining / account.budgetLimit) * 100;

        if (remainingPercent <= account.thresholdPercent) return 'text-red-600 bg-red-50';
        if (remainingPercent <= 50) return 'text-yellow-600 bg-yellow-50';
        return 'text-green-600 bg-green-50';
    };

    const getStatusText = (account: AdAccount) => {
        const remaining = account.budgetLimit - account.currentSpend;
        const remainingPercent = (remaining / account.budgetLimit) * 100;

        if (remainingPercent <= account.thresholdPercent) return '警報';
        if (remainingPercent <= 50) return '注意';
        return '正常';
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-center py-12">
                    <p className="text-gray-500">載入中...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700">{error}</p>
                    <button
                        onClick={fetchData}
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                        重試
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">儀表板</h1>

            {/* 統計卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">總客戶數</p>
                            <p className="text-3xl font-bold text-gray-800">{stats.totalClients}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <UsersIcon className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">活躍帳號</p>
                            <p className="text-3xl font-bold text-gray-800">{stats.activeAccounts}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                            <TrendingUp className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">警報數</p>
                            <p className="text-3xl font-bold text-gray-800">{stats.alerts}</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg">
                            <Bell className="text-red-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* 廣告帳號列表 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800">廣告帳號狀態</h2>
                </div>

                {accounts.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <AlertCircle className="mx-auto mb-2" size={48} />
                        <p>尚無廣告帳號</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">客戶</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">帳號名稱</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">預算上限</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">目前花費</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">剩餘</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">狀態</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {accounts.map((account) => {
                                    const remaining = account.budgetLimit - account.currentSpend;
                                    const remainingPercent = (remaining / account.budgetLimit) * 100;

                                    return (
                                        <tr key={account.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-800">{account.client.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800">{account.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">${account.budgetLimit}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">${account.currentSpend}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{remainingPercent.toFixed(1)}%</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(account)}`}>
                                                    {getStatusText(account)}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
