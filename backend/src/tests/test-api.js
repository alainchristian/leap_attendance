// src/tests/test-api.js
const axios = require('axios');

const API_URL = 'http://localhost:3001/api';
let authToken = '';

const users = {
    admin: {
        email: 'admin@asyv.com',
        password: 'password123'
    },
    teacher: {
        email: 'teacher@asyv.com',
        password: 'password123'
    },
    supervisor: {
        email: 'supervisor@asyv.com',
        password: 'password123'
    }
};

const testUserAuth = async (userType) => {
    console.log(`\nTesting ${userType.toUpperCase()} Authentication and Permissions...`);
    
    try {
        // 1. Test Login
        console.log(`1. Testing ${userType} login...`);
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: users[userType].email,
            password: users[userType].password
        });

        if (loginResponse.data.success) {
            console.log('✓ Login successful');
            authToken = loginResponse.data.token;
            console.log('User Info:', {
                name: `${loginResponse.data.user.firstName} ${loginResponse.data.user.lastName}`,
                email: loginResponse.data.user.email,
                roles: loginResponse.data.user.roles.map(r => r.name)
            });

            // Set token for subsequent requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

            // 2. Test Me Endpoint
            console.log('\n2. Testing /me endpoint...');
            const meResponse = await axios.get(`${API_URL}/auth/me`);
            console.log('✓ Current user info retrieved:', {
                name: `${meResponse.data.user.firstName} ${meResponse.data.user.lastName}`,
                email: meResponse.data.user.email,
                roles: meResponse.data.user.roles.map(r => r.name)
            });

            // 3. Test Access to Users List
            console.log('\n3. Testing access to users list...');
            try {
                const usersResponse = await axios.get(`${API_URL}/users`);
                console.log(`✓ Retrieved ${usersResponse.data.data.length} users`);
            } catch (error) {
                if (error.response?.status === 403) {
                    console.log('✓ Correctly denied access to users list (insufficient permissions)');
                } else {
                    throw error;
                }
            }

            // 4. Test Access to EP Programs (if implemented)
            console.log('\n4. Testing access to EP programs...');
            try {
                const programsResponse = await axios.get(`${API_URL}/programs`);
                console.log(`✓ Retrieved ${programsResponse.data.data.length} programs`);
            } catch (error) {
                if (error.response?.status === 404) {
                    console.log('× Programs endpoint not implemented yet');
                } else if (error.response?.status === 403) {
                    console.log('✓ Correctly denied access to programs (insufficient permissions)');
                } else {
                    throw error;
                }
            }

            // 5. Test Access to Students (if implemented)
            console.log('\n5. Testing access to students...');
            try {
                const studentsResponse = await axios.get(`${API_URL}/students`);
                console.log(`✓ Retrieved ${studentsResponse.data.data.length} students`);
            } catch (error) {
                if (error.response?.status === 404) {
                    console.log('× Students endpoint not implemented yet');
                } else if (error.response?.status === 403) {
                    console.log('✓ Correctly denied access to students (insufficient permissions)');
                } else {
                    throw error;
                }
            }

            // 6. Test Logout
            console.log('\n6. Testing logout...');
            const logoutResponse = await axios.post(`${API_URL}/auth/logout`);
            if (logoutResponse.data.success) {
                console.log('✓ Logout successful');
            }

        } else {
            throw new Error('Login failed');
        }
    } catch (error) {
        console.error(`\n❌ Error in ${userType} tests:`, {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            details: error.response?.data
        });
    }
};

const runAllTests = async () => {
    // Test each user type
    await testUserAuth('teacher');
    await testUserAuth('supervisor');
    await testUserAuth('admin');

    // Test invalid login
    console.log('\nTesting Invalid Login...');
    try {
        await axios.post(`${API_URL}/auth/login`, {
            email: 'invalid@email.com',
            password: 'wrongpassword'
        });
    } catch (error) {
        if (error.response?.status === 401) {
            console.log('✓ Correctly rejected invalid credentials');
        } else {
            console.error('× Unexpected error with invalid login:', error.response?.status);
        }
    }

    // Test accessing protected route without token
    console.log('\nTesting Protected Route Without Token...');
    delete axios.defaults.headers.common['Authorization'];
    try {
        await axios.get(`${API_URL}/users`);
    } catch (error) {
        if (error.response?.status === 401) {
            console.log('✓ Correctly rejected unauthorized access');
        } else {
            console.error('× Unexpected error with unauthorized access:', error.response?.status);
        }
    }
};

// Run all tests
console.log('Starting Comprehensive API Tests...');
runAllTests()
    .then(() => console.log('\nAll tests completed!'))
    .catch(error => console.error('\nTest execution failed:', error));