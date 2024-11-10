const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Role, Permission } = require('../models');

class AuthService {
    async login(email, password) {
        try {
            // Find user with roles and permissions
            const user = await User.findOne({
                where: { email },
                include: [{
                    model: Role,
                    as: 'roles',
                    include: [{
                        model: Permission,
                        as: 'permissions'
                    }]
                }]
            });

            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Check if user is active
            if (!user.isActive) {
                throw new Error('Account is inactive');
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                throw new Error('Invalid credentials');
            }

            // Generate JWT token
            const token = jwt.sign(
                { 
                    id: user.id,
                    email: user.email,
                    userType: user.userType
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE || '24h' }
            );

            // Prepare user response without sensitive data
            const userResponse = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                userType: user.userType,
                roles: user.roles.map(role => ({
                    name: role.name,
                    permissions: role.permissions.map(p => p.name)
                }))
            };

            return {
                success: true,
                token,
                user: userResponse
            };
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser(userId) {
        try {
            const user = await User.findByPk(userId, {
                include: [{
                    model: Role,
                    as: 'roles',
                    include: [{
                        model: Permission,
                        as: 'permissions'
                    }]
                }],
                attributes: { exclude: ['password'] }
            });

            if (!user) {
                throw new Error('User not found');
            }

            if (!user.isActive) {
                throw new Error('Account is inactive');
            }

            return {
                success: true,
                data: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    userType: user.userType,
                    roles: user.roles.map(role => ({
                        name: role.name,
                        permissions: role.permissions.map(p => p.name)
                    }))
                }
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AuthService();