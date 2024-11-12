import axios from 'axios';
import { API_CONFIG, STORAGE_KEYS, API_ENDPOINTS } from '../config/constants';

class UserService {
    constructor() {
        this.api = axios.create({
            baseURL: API_CONFIG.BASE_URL,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Add request interceptor
        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                    console.log('Adding token to request:', token); // Debug log
                }
                return config;
            },
            (error) => {
                console.error('Request interceptor error:', error);
                return Promise.reject(error);
            }
        );

        // Add response interceptor
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    console.log('Authentication error detected'); // Debug log
                    localStorage.removeItem(STORAGE_KEYS.TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.USER);
                    window.location.href = '/login';
                }
                return Promise.reject(this.handleError(error));
            }
        );
    }

    async getUserList() {
        try {
            console.log('Fetching users...'); // Debug log
            const response = await this.api.get(API_ENDPOINTS.USERS.BASE);
            console.log('Users response:', response.data); // Debug log
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error); // Debug log
            throw this.handleError(error);
        }
    }

    async getUser(id) {
        try {
            const response = await this.api.get(`${API_ENDPOINTS.USERS.BASE}/${id}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async createUser(userData) {
        try {
            const response = await this.api.post(API_ENDPOINTS.USERS.BASE, userData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async updateUser(id, userData) {
        try {
            const response = await this.api.put(`${API_ENDPOINTS.USERS.BASE}/${id}`, userData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async deleteUser(id) {
        try {
            const response = await this.api.delete(`${API_ENDPOINTS.USERS.BASE}/${id}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async toggleUserStatus(id) {
        try {
            const response = await this.api.patch(API_ENDPOINTS.USERS.TOGGLE_STATUS(id));
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getUserRoles() {
        try {
            const response = await this.api.get(API_ENDPOINTS.USERS.ROLES);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    handleError(error) {
        console.error('Error details:', error); // Debug log
        if (error.response) {
            return {
                message: error.response.data.message || 'An error occurred',
                status: error.response.status,
                data: error.response.data
            };
        }
        
        if (error.request) {
            return {
                message: 'No response from server. Please check your internet connection.',
                status: 503,
                data: null
            };
        }
        
        return {
            message: error.message || 'An unexpected error occurred',
            status: 500,
            data: null
        };
    }
}

export const userService = new UserService();
export default userService;