import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// 請求攔截器：自動附加 Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 回應攔截器：處理 401 錯誤
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export interface Client {
    id: string;
    name: string;
    adAccounts: AdAccount[];
    lineGroups: LineGroup[];
}

export interface AdAccount {
    id: string;
    accountId: string;
    name: string;
    budgetLimit: number;
    currentSpend: number;
    thresholdPercent: number;
    isActive: boolean;
    clientId: string;
}

export interface LineGroup {
    id: string;
    groupId: string;
    name: string;
}
