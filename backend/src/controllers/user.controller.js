const { User, Role, Permission } = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

class UserController {
    // Get all users with roles and permissions
    async index(req, res) {
        try {
            const users = await User.findAll({
                include: [{
                    model: Role,
                    as: 'roles',
                    include: [{
                        model: Permission,
                        as: 'permissions'
                    }]
                }],
                attributes: { exclude: ['password'] },
                order: [['createdAt', 'DESC']]
            });

            return res.json({
                success: true,
                data: users
            });
        } catch (error) {
            console.error('Get users error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error fetching users'
            });
        }
    }

    // Get single user with roles and permissions
    async show(req, res) {
        try {
            const user = await User.findByPk(req.params.id, {
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

            return res.json({
                success: true,
                data: user
            });
        } catch (error) {
            console.error('Get user error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error fetching user'
            });
        }
    }

    // Create new user with roles
    async store(req, res) {
        try {
            const { firstName, lastName, email, password, gender, userType, roles, isActive = true } = req.body;

            // Check if email already exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered'
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = await User.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                gender,
                userType,
                isActive
            });

            // Assign roles
            if (roles && roles.length > 0) {
                await user.setRoles(roles);
            } else {
                // Assign default role based on userType
                const defaultRole = await Role.findOne({ where: { name: userType } });
                if (defaultRole) {
                    await user.setRoles([defaultRole.id]);
                }
            }

            // Fetch created user with roles
            const createdUser = await User.findByPk(user.id, {
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

            return res.status(201).json({
                success: true,
                data: createdUser,
                message: 'User created successfully'
            });
        } catch (error) {
            console.error('Create user error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error creating user'
            });
        }
    }

    // Update user and their roles
    async update(req, res) {
        try {
            const { firstName, lastName, email, password, gender, userType, roles, isActive } = req.body;

            // Check if user exists
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Check email uniqueness if changed
            if (email && email !== user.email) {
                const existingUser = await User.findOne({
                    where: {
                        email,
                        id: { [Op.ne]: req.params.id }
                    }
                });

                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email already in use'
                    });
                }
            }

            // Prepare update data
            const updateData = {
                firstName,
                lastName,
                email,
                gender,
                userType,
                isActive
            };

            // Update password if provided
            if (password) {
                updateData.password = await bcrypt.hash(password, 10);
            }

            // Update user
            await user.update(updateData);

            // Update roles if provided
            if (roles) {
                await user.setRoles(roles);
            } else if (userType && userType !== user.userType) {
                // Update role based on new userType
                const newRole = await Role.findOne({ where: { name: userType } });
                if (newRole) {
                    await user.setRoles([newRole.id]);
                }
            }

            // Fetch updated user with roles
            const updatedUser = await User.findByPk(req.params.id, {
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

            return res.json({
                success: true,
                data: updatedUser,
                message: 'User updated successfully'
            });
        } catch (error) {
            console.error('Update user error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error updating user'
            });
        }
    }

    // Delete user
    async destroy(req, res) {
        try {
            const user = await User.findByPk(req.params.id);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Check if user is the last admin
            if (user.userType === 'Admin') {
                const adminCount = await User.count({
                    where: { userType: 'Admin' }
                });

                if (adminCount === 1) {
                    return res.status(400).json({
                        success: false,
                        message: 'Cannot delete the last admin user'
                    });
                }
            }

            await user.destroy();

            return res.json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            console.error('Delete user error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error deleting user'
            });
        }
    }

    // Change user status (active/inactive)
    async updateStatus(req, res) {
        try {
            const { isActive } = req.body;
            const user = await User.findByPk(req.params.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Prevent deactivating last admin
            if (user.userType === 'Admin' && !isActive) {
                const activeAdminCount = await User.count({
                    where: { 
                        userType: 'Admin',
                        isActive: true
                    }
                });

                if (activeAdminCount === 1) {
                    return res.status(400).json({
                        success: false,
                        message: 'Cannot deactivate the last active admin'
                    });
                }
            }

            await user.update({ isActive });

            return res.json({
                success: true,
                message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
            });
        } catch (error) {
            console.error('Update user status error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error updating user status'
            });
        }
    }
}

module.exports = new UserController();