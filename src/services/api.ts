import axios from 'axios';

const API_URL = 'https://api.tax-e.live/api/admin';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const login = async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    return response.data;
};

export const getStats = async () => {
    const response = await api.get('/stats');
    return response.data;
};

export const getUsers = async () => {
    const response = await api.get('/users');
    return response.data;
};

export const suspendUser = async (userId: string, reason: string) => {
    const response = await api.patch(`/users/${userId}/suspend`, { reason });
    return response.data;
};

export const unsuspendUser = async (userId: string) => {
    const response = await api.patch(`/users/${userId}/unsuspend`);
    return response.data;
};

export const requestUserDeletion = async (userId: string, reason: string) => {
    const response = await api.post(`/users/${userId}/delete-request`, { reason });
    return response.data;
};

// Profile
export const updateProfile = async (data: { name?: string; password?: string }) => {
    const response = await api.put('/profile', data);
    return response.data;
};

export const createAdmin = async (data: { name: string; email: string; password: string }) => {
    const response = await api.post('/create-admin', data);
    return response.data;
};

export const deleteUserNow = async (userId: string, reason: string) => {
    const response = await api.delete(`/users/${userId}`, { data: { reason } });
    return response.data;
};

export const getReceipts = async () => {
    const response = await api.get('/receipts');
    return response.data;
};

export const getPayments = async () => {
    const response = await api.get('/payments');
    return response.data;
};

export default api;
