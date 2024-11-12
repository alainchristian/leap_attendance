// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:3000/api',
    TIMEOUT: 30000, // 30 seconds
};

// Storage keys
const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
    THEME: 'theme',
    LANGUAGE: 'language',
};

// User Types and Roles
const USER_TYPES = {
    ADMIN: 'Admin',
    TEACHER: 'Teacher',
    SUPERVISOR: 'Supervisor'
};

const ROLES = [
    USER_TYPES.ADMIN,
    USER_TYPES.TEACHER,
    USER_TYPES.SUPERVISOR
];

const GENDERS = ['Male', 'Female'];

// API Endpoints
const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        ME: '/auth/me',
    },
    USERS: {
        BASE: '/users',
        ROLES: '/users/roles',
        TOGGLE_STATUS: (id) => `/users/${id}/toggle-status`,
    }
};

export {
    API_CONFIG,
    STORAGE_KEYS,
    USER_TYPES,
    ROLES,
    GENDERS,
    API_ENDPOINTS
};