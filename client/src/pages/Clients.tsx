import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Plus, Trash2, AlertCircle, MessageCircle } from 'lucide-react';

interface Client {
    id: string;
    name: string;
    adAccounts: any[];
    lineGroups: any[];
}

export const Clients: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddClient, setShowAddClient] = useState(false);
    const [showAddAccount, setShowAddAccount] = useState<string | null>(null);
    const [showAddLineGroup, setShowAddLineGroup] = useState<string | null>(null);
    const [newClientName, setNewClientName] = useState('');
    const [newAccount, setNewAccount] = useState({
        accountId: '',
        name: '',
        budgetLimit: 1000,
        thresholdPercent: 20
    });
    const [newLineGroup, setNewLineGroup] = useState({
        groupId: '',
        name: ''
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await api.get('/clients');
            setClients(res.data);
        } catch (err: any) {
            console.error('獲取客戶失敗:', err);
            setError(err.response?.data?.error || '無法載入客戶列表');
        } finally {
            setLoading(false);
        }
    };

    const handleAddClient = async () => {
        if (!newClientName.trim()) return;

        try {
            await api.post('/clients', { name: newClientName });
            setNewClientName('');
            setShowAddClient(false);
            fetchClients();
        } catch (err: any) {
            alert(err.response?.data?.error || '新增客戶失敗');
        }
    };

    const handleDeleteClient = async (id: string) => {
        if (!confirm('確定要刪除此客戶嗎？')) return;

        try {
            await api.delete(`/clients/${id}`);
            fetchClients();
        } catch (err: any) {
            alert(err.response?.data?.error || '刪除客戶失敗');
        }
    };

    const handleAddAccount = async (clientId: string) => {
        try {
            await api.post('/ad-accounts', {
                clientId,
                ...newAccount
            });
            setNewAccount({
                accountId: '',
                name: '',
                budgetLimit: 1000,
                thresholdPercent: 20
            });
            setShowAddAccount(null);
            fetchClients();
        } catch (err: any) {
            alert(err.response?.data?.error || '新增廣告帳號失敗');
        }
    };

    const handleDeleteAccount = async (id: string) => {
        if (!confirm('確定要刪除此廣告帳號嗎？')) return;

        try {
            await api.delete(`/ad-accounts/${id}`);
            fetchClients();
        } catch (err: any) {
            alert(err.response?.data?.error || '刪除廣告帳號失敗');
        }
    };

    const handleAddLineGroup = async (clientId: string) => {
        if (!newLineGroup.groupId.trim() || !newLineGroup.name.trim()) {
            alert('請填寫完整的 LINE 群組資訊');
            return;
        }

        try {
            await api.post(`/clients/${clientId}/line-groups`, newLineGroup);
            setNewLineGroup({
                groupId: '',
                name: ''
            });
            setShowAddLineGroup(null);
            fetchClients();
        } catch (err: any) {
            alert(err.response?.data?.error || '新增 LINE 群組失敗');
        }
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
                        onClick={fetchClients}
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
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">客戶管理</h1>
                <button
                    onClick={() => setShowAddClient(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus size={20} />
                    新增客戶
                </button>
            </div>

            {/* 新增客戶表單 */}
            {showAddClient && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">新增客戶</h3>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={newClientName}
                            onChange={(e) => setNewClientName(e.target.value)}
                            placeholder="客戶名稱"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button
                            onClick={handleAddClient}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            新增
                        </button>
                        <button
                            onClick={() => {
                                setShowAddClient(false);
                                setNewClientName('');
                            }}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                            取消
                        </button>
                    </div>
                </div>
            )}

            {/* 客戶列表 */}
            {clients.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-gray-500">尚無客戶，請新增第一個客戶</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {clients.map((client) => (
                        <div key={client.id} className="bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">{client.name}</h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {client.adAccounts.length} 個廣告帳號 • {client.lineGroups.length} 個 LINE 群組
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowAddAccount(client.id)}
                                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
                                    >
                                        新增帳號
                                    </button>
                                    <button
                                        onClick={() => setShowAddLineGroup(client.id)}
                                        className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm flex items-center gap-2"
                                    >
                                        <MessageCircle size={16} />
                                        新增 LINE 群組
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClient(client.id)}
                                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* 新增帳號表單 */}
                            {showAddAccount === client.id && (
                                <div className="p-6 bg-gray-50 border-b border-gray-100">
                                    <h3 className="text-sm font-semibold mb-4">新增廣告帳號</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            value={newAccount.accountId}
                                            onChange={(e) => setNewAccount({ ...newAccount, accountId: e.target.value })}
                                            placeholder="帳號 ID (例: act_123456)"
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <input
                                            type="text"
                                            value={newAccount.name}
                                            onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                                            placeholder="帳號名稱"
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <input
                                            type="number"
                                            value={newAccount.budgetLimit}
                                            onChange={(e) => setNewAccount({ ...newAccount, budgetLimit: Number(e.target.value) })}
                                            placeholder="預算上限"
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <input
                                            type="number"
                                            value={newAccount.thresholdPercent}
                                            onChange={(e) => setNewAccount({ ...newAccount, thresholdPercent: Number(e.target.value) })}
                                            placeholder="警報門檻 (%)"
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => handleAddAccount(client.id)}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            新增
                                        </button>
                                        <button
                                            onClick={() => setShowAddAccount(null)}
                                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                        >
                                            取消
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* 新增 LINE 群組表單 */}
                            {showAddLineGroup === client.id && (
                                <div className="p-6 bg-green-50 border-b border-gray-100">
                                    <h3 className="text-sm font-semibold mb-4">新增 LINE 群組</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            value={newLineGroup.groupId}
                                            onChange={(e) => setNewLineGroup({ ...newLineGroup, groupId: e.target.value })}
                                            placeholder="LINE 群組 ID (例: C1234567890)"
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        />
                                        <input
                                            type="text"
                                            value={newLineGroup.name}
                                            onChange={(e) => setNewLineGroup({ ...newLineGroup, name: e.target.value })}
                                            placeholder="群組名稱"
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        />
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => handleAddLineGroup(client.id)}
                                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                        >
                                            新增
                                        </button>
                                        <button
                                            onClick={() => setShowAddLineGroup(null)}
                                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                        >
                                            取消
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* LINE 群組列表 */}
                            {client.lineGroups.length > 0 && (
                                <div className="p-6 border-b border-gray-100">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <MessageCircle size={16} className="text-green-600" />
                                        LINE 群組
                                    </h3>
                                    <div className="space-y-2">
                                        {client.lineGroups.map((group: any) => (
                                            <div key={group.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-800">{group.name}</p>
                                                    <p className="text-sm text-gray-500">{group.groupId}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 廣告帳號列表 */}
                            {client.adAccounts.length > 0 && (
                                <div className="p-6">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">廣告帳號</h3>
                                    <div className="space-y-2">
                                        {client.adAccounts.map((account: any) => (
                                            <div key={account.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-800">{account.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {account.accountId} • 預算: ${account.budgetLimit} • 門檻: {account.thresholdPercent}%
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteAccount(account.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
