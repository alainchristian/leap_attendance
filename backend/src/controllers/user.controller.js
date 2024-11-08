

// // src/controllers/user.controller.js
// const { User, Role, Permission } = require('../models');
// const bcrypt = require('bcryptjs');

// class UserController {
//     async index(req, res) {
//         try {
//             const users = await User.findAll({
//                 include: [{
//                     model: Role,
//                     as: 'roles',
//                     include: [{
//                         model: Permission,
//                         as: 'permissions'
//                     }]
//                 }],
//                 attributes: { exclude: ['password'] }
//             });

//             res.json({
//                 success: true,
//                 data: users
//             });
//         } catch (error) {
//             res.status(500).json({
//                 success: false,
//                 message: 'Internal server error',
//                 error: error.message
//             });
//         }
//     }

//     async show(req, res) {
//         try {
//             const user = await User.findByPk(req.params.id, {
//                 include: [{
//                     model: Role,
//                     as: 'roles',
//                     include: [{
//                         model: Permission,
//                         as: 'permissions'
//                     }]
//                 }],
//                 attributes: { exclude: ['password'] }
//             });

//             if (!user) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'User not found'
//                 });
//             }

//             res.json({
//                 success: true,
//                 data: user
//             });
//         } catch (error) {
//             res.status(500).json({
//                 success: false,
//                 message: 'Internal server error',
//                 error: error.message
//             });
//         }
//     }

//     async store(req, res) {
//         try {
//             // Hash password before saving
//             const hashedPassword = await bcrypt.hash(req.body.password, 10);
            
//             const userData = {
//                 ...req.body,
//                 password: hashedPassword
//             };

//             const user = await User.create(userData);

//             // Assign roles if provided
//             if (req.body.roles) {
//                 await user.setRoles(req.body.roles);
//             }

//             // Fetch user with roles
//             const createdUser = await User.findByPk(user.id, {
//                 include: [{
//                     model: Role,
//                     as: 'roles',
//                     include: [{
//                         model: Permission,
//                         as: 'permissions'
//                     }]
//                 }],
//                 attributes: { exclude: ['password'] }
//             });

//             res.status(201).json({
//                 success: true,
//                 data: createdUser
//             });
//         } catch (error) {
//             res.status(500).json({
//                 success: false,
//                 message: 'Internal server error',
//                 error: error.message
//             });
//         }
//     }

//     async update(req, res) {
//         try {
//             const userData = { ...req.body };
            
//             // Hash password if it's being updated
//             if (userData.password) {
//                 userData.password = await bcrypt.hash(userData.password, 10);
//             }

//             const [updated] = await User.update(userData, {
//                 where: { id: req.params.id }
//             });

//             if (!updated) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'User not found'
//                 });
//             }

//             const user = await User.findByPk(req.params.id);

//             // Update roles if provided
//             if (req.body.roles) {
//                 await user.setRoles(req.body.roles);
//             }

//             // Fetch updated user with roles
//             const updatedUser = await User.findByPk(user.id, {
//                 include: [{
//                     model: Role,
//                     as: 'roles',
//                     include: [{
//                         model: Permission,
//                         as: 'permissions'
//                     }]
//                 }],
//                 attributes: { exclude: ['password'] }
//             });

//             res.json({
//                 success: true,
//                 data: updatedUser
//             });
//         } catch (error) {
//             res.status(500).json({
//                 success: false,
//                 message: 'Internal server error',
//                 error: error.message
//             });
//         }
//     }

//     async updatePassword(req, res) {
//         try {
//             const { oldPassword, newPassword } = req.body;
//             const user = await User.findByPk(req.params.id);

//             if (!user) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'User not found'
//                 });
//             }

//             // Verify old password
//             const isValidPassword = await bcrypt.compare(oldPassword, user.password);
//             if (!isValidPassword) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Invalid current password'
//                 });
//             }

//             // Update password
//             const hashedPassword = await bcrypt.hash(newPassword, 10);
//             await user.update({ password: hashedPassword });

//             res.json({
//                 success: true,
//                 message: 'Password updated successfully'
//             });
//         } catch (error) {
//             res.status(500).json({
//                 success: false,
//                 message: 'Internal server error',
//                 error: error.message
//             });
//         }
//     }
// }

// module.exports = new UserController();

// src/controllers/user.controller.js
const { User, Role, Permission } = require('../models');
const bcrypt = require('bcryptjs');

class UserController {
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
                attributes: { exclude: ['password'] }
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

    async store(req, res) {
        try {
            // Hash password
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const user = await User.create({
                ...req.body,
                password: hashedPassword
            });

            // Assign roles if provided
            if (req.body.roles) {
                await user.setRoles(req.body.roles);
            }

            // Fetch user with roles
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
                data: createdUser
            });
        } catch (error) {
            console.error('Create user error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error creating user'
            });
        }
    }

    async update(req, res) {
        try {
            const [updated] = await User.update(req.body, {
                where: { id: req.params.id }
            });

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Update roles if provided
            const user = await User.findByPk(req.params.id);
            if (req.body.roles) {
                await user.setRoles(req.body.roles);
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
                data: updatedUser
            });
        } catch (error) {
            console.error('Update user error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error updating user'
            });
        }
    }

    async destroy(req, res) {
        try {
            const deleted = await User.destroy({
                where: { id: req.params.id }
            });

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

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
}

module.exports = new UserController();