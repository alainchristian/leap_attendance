import api from '../utils/api';

const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            
            if (response.data.success) {
                // Store token and user data
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            
            return response.data;
        } catch (error) {
            throw {
                message: error.response?.data?.message || 'Login failed',
                errors: error.response?.data?.errors
            };
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            // Always clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    getCurrentUser: async () => {
        try {
            const response = await api.get('/auth/me');
            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw {
                message: error.response?.data?.message || 'Failed to get user data',
                errors: error.response?.data?.errors
            };
        }
    },

    hasPermission: (permission) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.roles) return false;
        
        return user.roles.some(role => 
            role.permissions?.includes(permission)
        );
    },

    hasRole: (roleName) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.roles) return false;
        
        return user.roles.some(role => role.name === roleName);
    },

    getToken: () => localStorage.getItem('token'),
    
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

export default authService;