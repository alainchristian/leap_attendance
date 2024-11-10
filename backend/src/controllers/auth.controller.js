const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Role, Permission } = require('../models');

class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;

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

            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Check if user is active
            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Your account is inactive'
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    roles: user.roles.map(role => role.name)
                },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userType: user.userType,
                    isActive: user.isActive,
                    roles: user.roles.map(role => ({
                        name: role.name,
                        permissions: role.permissions.map(p => p.name)
                    })),
                    name: `${user.firstName} ${user.lastName}`,
                    rolesString: user.roles.map(role => role.name).join(', ') // Added as a comma-separated string
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Error during login'
            });
        }
    }

    async me(req, res) {
        try {
            const user = await User.findByPk(req.user.id, {
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
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Check if user is still active
            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Your account has been deactivated'
                });
            }

            res.json({
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userType: user.userType,
                    isActive: user.isActive,
                    roles: user.roles.map(role => ({
                        name: role.name,
                        permissions: role.permissions.map(p => p.name)
                    }))
                }
            });
        } catch (error) {
            console.error('Get user error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching user data'
            });
        }
    }

    // Add logout handler (optional since we're using JWT)
    async logout(req, res) {
        try {
            // You could implement token blacklisting here if needed
            res.json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                success: false,
                message: 'Error during logout'
            });
        }
    }
}

module.exports = new AuthController();