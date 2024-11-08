'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // 1. Create Roles
      const roles = await queryInterface.bulkInsert(
        'roles',
        [
          {
            name: 'Admin',
            description: 'System Administrator',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            name: 'Teacher',
            description: 'EP Teacher',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            name: 'Supervisor',
            description: 'EP Supervisor',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        { returning: true }
      );

      // 2. Create Permissions
      const permissions = await queryInterface.bulkInsert(
        'permissions',
        [
          // User Management
          {
            name: 'user.view',
            description: 'View users',
            module: 'users',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            name: 'user.create',
            description: 'Create users',
            module: 'users',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            name: 'user.edit',
            description: 'Edit users',
            module: 'users',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            name: 'user.delete',
            description: 'Delete users',
            module: 'users',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
          },
          // Student Management
          {
            name: 'student.view',
            description: 'View students',
            module: 'students',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            name: 'student.create',
            description: 'Create students',
            module: 'students',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            name: 'student.edit',
            description: 'Edit students',
            module: 'students',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
          },
          // EP Management
          {
            name: 'ep.view',
            description: 'View EP programs',
            module: 'programs',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            name: 'ep.manage',
            description: 'Manage EP programs',
            module: 'programs',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
          },
          // Attendance
          {
            name: 'attendance.view',
            description: 'View attendance',
            module: 'attendance',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            name: 'attendance.mark',
            description: 'Mark attendance',
            module: 'attendance',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
          },
          // Reports
          {
            name: 'report.view',
            description: 'View reports',
            module: 'reports',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            name: 'report.manage',
            description: 'Manage reports',
            module: 'reports',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        { returning: true }
      );

      // 3. Create Users
      const hashedPassword = await bcrypt.hash('password123', 10);
      const users = await queryInterface.bulkInsert(
        'users',
        [
          {
            first_name: 'Admin',
            last_name: 'User',
            email: 'admin@asyv.com',
            password: hashedPassword,
            gender: 'Male',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            first_name: 'John',
            last_name: 'Teacher',
            email: 'teacher@asyv.com',
            password: hashedPassword,
            gender: 'Male',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            first_name: 'Sarah',
            last_name: 'Supervisor',
            email: 'supervisor@asyv.com',
            password: hashedPassword,
            gender: 'Female',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        { returning: true }
      );

      // Get role IDs
      const [roleRows] = await queryInterface.sequelize.query(
        `SELECT id, name FROM roles;`
      );
      
      const adminRoleId = roleRows.find(r => r.name === 'Admin').id;
      const teacherRoleId = roleRows.find(r => r.name === 'Teacher').id;
      const supervisorRoleId = roleRows.find(r => r.name === 'Supervisor').id;

      // Get user IDs
      const [userRows] = await queryInterface.sequelize.query(
        `SELECT id, email FROM users;`
      );
      
      const adminUserId = userRows.find(u => u.email === 'admin@asyv.com').id;
      const teacherUserId = userRows.find(u => u.email === 'teacher@asyv.com').id;
      const supervisorUserId = userRows.find(u => u.email === 'supervisor@asyv.com').id;

      // 4. Assign Roles to Users
      await queryInterface.bulkInsert(
        'user_roles',
        [
          {
            user_id: adminUserId,
            role_id: adminRoleId,
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            user_id: teacherUserId,
            role_id: teacherRoleId,
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            user_id: supervisorUserId,
            role_id: supervisorRoleId,
            created_at: new Date(),
            updated_at: new Date()
          }
        ]
      );

      // Get permission IDs
      const [permissionRows] = await queryInterface.sequelize.query(
        `SELECT id FROM permissions;`
      );

      // 5. Assign All Permissions to Admin Role
      const adminRolePermissions = permissionRows.map(permission => ({
        role_id: adminRoleId,
        permission_id: permission.id,
        created_at: new Date(),
        updated_at: new Date()
      }));

      await queryInterface.bulkInsert('role_permissions', adminRolePermissions);

      // 6. Assign Specific Permissions to Teacher Role
      const teacherPermissions = ['student.view', 'attendance.view', 'attendance.mark', 'ep.view'];
      const [teacherPermissionRows] = await queryInterface.sequelize.query(
        `SELECT id FROM permissions WHERE name IN (${teacherPermissions.map(p => `'${p}'`).join(',')});`
      );

      const teacherRolePermissions = teacherPermissionRows.map(permission => ({
        role_id: teacherRoleId,
        permission_id: permission.id,
        created_at: new Date(),
        updated_at: new Date()
      }));

      await queryInterface.bulkInsert('role_permissions', teacherRolePermissions);

      // 7. Assign Specific Permissions to Supervisor Role
      const supervisorPermissions = ['student.view', 'attendance.view', 'report.view', 'ep.view'];
      const [supervisorPermissionRows] = await queryInterface.sequelize.query(
        `SELECT id FROM permissions WHERE name IN (${supervisorPermissions.map(p => `'${p}'`).join(',')});`
      );

      const supervisorRolePermissions = supervisorPermissionRows.map(permission => ({
        role_id: supervisorRoleId,
        permission_id: permission.id,
        created_at: new Date(),
        updated_at: new Date()
      }));

      await queryInterface.bulkInsert('role_permissions', supervisorRolePermissions);

      console.log('All seeds completed successfully');

    } catch (error) {
      console.error('Error in seeding:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Delete in reverse order of creation
    await queryInterface.bulkDelete('role_permissions', null, {});
    await queryInterface.bulkDelete('user_roles', null, {});
    await queryInterface.bulkDelete('permissions', null, {});
    await queryInterface.bulkDelete('roles', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};