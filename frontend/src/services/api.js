// src/services/api.js
import axios from 'axios';

const TOKEN_KEY = '@ASYVAuth:token';

// Create axios instance with default config
const api = axios.create({
    baseURL: '/api',  // Use relative path for Vite proxy
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
        
        // Add token to headers if it exists
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Debug log for requests
        console.log('API Request:', {
            method: config.method?.toUpperCase(),
            url: `${config.baseURL}${config.url}`,
            headers: {
                ...config.headers,
                Authorization: config.headers.Authorization ? 'Bearer [TOKEN]' : undefined
            },
            data: config.data,
            timestamp: new Date().toISOString()
        });
        
        // Log authentication status
        console.log('Auth Status:', {
            hasToken: !!token,
            endpoint: config.url,
            isAuthRequest: config.url?.includes('/auth/')
        });

        return config;
    },
    (error) => {
        // Log request errors
        console.error('Request Error:', {
            message: error.message,
            config: error.config,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        // Debug log successful responses
        console.log('API Response:', {
            status: response.status,
            url: response.config.url,
            method: response.config.method,
            data: response.data,
            timestamp: new Date().toISOString()
        });

        // Additional logging for auth-related responses
        if (response.config.url?.includes('/auth/')) {
            console.log('Auth Response:', {
                endpoint: response.config.url,
                success: response.data.success,
                hasUser: !!response.data.user,
                userRoles: response.data.user?.roles?.map(r => r.name),
                timestamp: new Date().toISOString()
            });
        }

        return response;
    },
    (error) => {
        // Detailed error logging
        console.error('API Error:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
            method: error.config?.method,
            data: error.response?.data,
            timestamp: new Date().toISOString()
        });

        // Handle different error scenarios
        if (error.response?.status === 401) {
            console.log('Unauthorized access - clearing authentication');
            localStorage.removeItem(TOKEN_KEY);
            window.location.href = '/login';
        } else if (error.response?.status === 403) {
            console.error('Permission denied:', {
                url: error.config?.url,
                requiredPermissions: error.response?.data?.requiredPermissions
            });
        } else if (error.response?.status === 404) {
            console.error('Resource not found:', error.config?.url);
        } else if (error.response?.status >= 500) {
            console.error('Server Error:', {
                status: error.response.status,
                message: error.response.data?.message || 'Internal Server Error'
            });
        }

        return Promise.reject(error);
    }
);

// API Health Check
api.checkHealth = async () => {
    try {
        const response = await api.get('/health');
        console.log('API Health Check:', {
            status: 'success',
            data: response.data,
            timestamp: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error('API Health Check Failed:', {
            status: 'error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
        return false;
    }
};

// Auth-specific API methods
api.auth = {
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            console.error('Login request failed:', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
            localStorage.removeItem(TOKEN_KEY);
        } catch (error) {
            console.error('Logout request failed:', error);
            throw error;
        }
    },

    getCurrentUser: async () => {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            console.error('Get current user failed:', error);
            throw error;
        }
    },

    refreshToken: async () => {
        try {
            const response = await api.post('/auth/refresh');
            const { token } = response.data;
            localStorage.setItem(TOKEN_KEY, token);
            return token;
        } catch (error) {
            console.error('Token refresh failed:', error);
            throw error;
        }
    }
};

export default api;