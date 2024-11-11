// src/services/authService.js
import api from './api';

const TOKEN_KEY = '@ASYVAuth:token';

const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            
            if (response.data.success) {
                const { token, user } = response.data;
                localStorage.setItem(TOKEN_KEY, token);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                return { success: true, user };
            }
            return { success: false };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            localStorage.removeItem(TOKEN_KEY);
            delete api.defaults.headers.common['Authorization'];
        }
    },

    getCurrentUser: async () => {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to get user data');
        }
    },

    getToken: () => localStorage.getItem(TOKEN_KEY),

    isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY)
};

export default authService;