// src/tests/auth.test.js
const axios = require('axios');

const API_URL = 'http://localhost:3001/api';
let authToken = '';

const testAuth = async () => {
    try {
        console.log('1. Testing Login...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@asyv.com',
            password: 'password123'
        });

        if (loginResponse.data.success && loginResponse.data.token) {
            console.log('✓ Login successful');
            authToken = loginResponse.data.token;
            console.log('User data:', loginResponse.data.user);

            // Set token for subsequent requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

            console.log('\n2. Testing Get Current User...');
            const meResponse = await axios.get(`${API_URL}/auth/me`);
            if (meResponse.data.success) {
                console.log('✓ Get current user successful');
                console.log('User data:', meResponse.data.user);
            }

            console.log('\n3. Testing Logout...');
            const logoutResponse = await axios.post(`${API_URL}/auth/logout`);
            if (logoutResponse.data.success) {
                console.log('✓ Logout successful');
            }
        }
    } catch (error) {
        console.error('Error:', error.response ? {
            status: error.response.status,
            message: error.response.data.message || error.response.statusText,
            data: error.response.data
        } : error.message);
    }
};

console.log('Starting Auth Tests...');
testAuth()
    .then(() => console.log('\nTests completed!'))
    .catch(console.error);