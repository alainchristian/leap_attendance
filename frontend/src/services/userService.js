import axios from 'axios';

class UserService {
    async getUsers() {
        try {
            const response = await axios.get('/api/users');
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getUser(id) {
        try {
            const response = await axios.get(`/api/users/${id}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async createUser(userData) {
        try {
            const response = await axios.post('/api/users', userData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async updateUser(id, userData) {
        try {
            const response = await axios.put(`/api/users/${id}`, userData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async deleteUser(id) {
        try {
            const response = await axios.delete(`/api/users/${id}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    handleError(error) {
        return {
            success: false,
            message: error.response?.data?.message || 'An error occurred',
            errors: error.response?.data?.errors || []
        };
    }
}

// Create instance
const userService = new UserService();

// Export both named and default
export { userService };
export default userService;