'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 1. Clean existing data
      console.log('Cleaning existing data...');
      await queryInterface.bulkDelete('role_permissions', null, { transaction });
      await queryInterface.bulkDelete('user_roles', null, { transaction });
      await queryInterface.bulkDelete('permissions', null, { transaction });
      await queryInterface.bulkDelete('roles', null, { transaction });
      await queryInterface.bulkDelete('users', null, { transaction });

      // 2. Create new permissions
      console.log('Creating permissions...');
      const permissionsList = [
        // User Management
        { name: 'user.view', description: 'View users list and details', module: 'users' },
        { name: 'user.create', description: 'Create new users', module: 'users' },
        { name: 'user.edit', description: 'Edit existing users', module: 'users' },
        { name: 'user.delete', description: 'Delete users', module: 'users' },
        
        // Student Management
        { name: 'student.view', description: 'View students list and details', module: 'students' },
        { name: 'student.create', description: 'Create new students', module: 'students' },
        { name: 'student.edit', description: 'Edit student information', module: 'students' },
        { name: 'student.delete', description: 'Delete students', module: 'students' },

        // EP Management
        { name: 'ep.view', description: 'View EP programs', module: 'programs' },
        { name: 'ep.create', description: 'Create new EP programs', module: 'programs' },
        { name: 'ep.edit', description: 'Edit EP programs', module: 'programs' },
        { name: 'ep.delete', description: 'Delete EP programs', module: 'programs' },
        { name: 'ep.assign_teacher', description: 'Assign teachers to EP programs', module: 'programs' },
        { name: 'ep.manage_enrollment', description: 'Manage student enrollment in EP', module: 'programs' },

        // Attendance Management
        { name: 'attendance.view', description: 'View attendance records', module: 'attendance' },
        { name: 'attendance.mark', description: 'Mark student attendance', module: 'attendance' },
        { name: 'attendance.edit', description: 'Edit attendance records', module: 'attendance' },
        { name: 'attendance.report', description: 'Generate attendance reports', module: 'attendance' },

        // Reports
        { name: 'report.view_general', description: 'View general reports', module: 'reports' },
        { name: 'report.view_detailed', description: 'View detailed reports', module: 'reports' },
        { name: 'report.export', description: 'Export reports', module: 'reports' },

        // Academic Year Management
        { name: 'academic.view', description: 'View academic years', module: 'academic' },
        { name: 'academic.manage', description: 'Manage academic years', module: 'academic' },
        { name: 'rotation.manage', description: 'Manage rotations', module: 'academic' }
      ].map(p => ({
        ...p,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }));

      await queryInterface.bulkInsert('permissions', permissionsList, { transaction });

      // 3. Create roles
      console.log('Creating roles...');
      const rolesList = [
        {
          name: 'Admin',
          description: 'System Administrator with full access',
        },
        {
          name: 'Teacher',
          description: 'EP Teacher with student and attendance management',
        },
        {
          name: 'Supervisor',
          description: 'EP Supervisor with oversight capabilities',
        },
        {
          name: 'AttendanceTaker',
          description: 'Dedicated attendance management role',
        }
      ].map(r => ({
        ...r,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }));

      await queryInterface.bulkInsert('roles', rolesList, { transaction });

      // 4. Create users
      console.log('Creating users...');
      const hashedPassword = await bcrypt.hash('password123', 10);
      const usersList = [
        {
          first_name: 'Admin',
          last_name: 'User',
          email: 'admin@asyv.com',
          gender: 'Male',
        },
        {
          first_name: 'John',
          last_name: 'Teacher',
          email: 'teacher@asyv.com',
          gender: 'Male',
        },
        {
          first_name: 'Sarah',
          last_name: 'Supervisor',
          email: 'supervisor@asyv.com',
          gender: 'Female',
        },
        {
          first_name: 'Mark',
          last_name: 'Attendance',
          email: 'attendance@asyv.com',
          gender: 'Male',
        }
      ].map(u => ({
        ...u,
        password: hashedPassword,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }));

      await queryInterface.bulkInsert('users', usersList, { transaction });

      // Get IDs for mapping
      const [roles] = await queryInterface.sequelize.query(
        'SELECT id, name FROM roles',
        { transaction }
      );

      const [permissions] = await queryInterface.sequelize.query(
        'SELECT id, name FROM permissions',
        { transaction }
      );

      const [users] = await queryInterface.sequelize.query(
        'SELECT id, email FROM users',
        { transaction }
      );

      // 5. Create role-permission mappings
      console.log('Creating role-permission mappings...');
      const rolePermissionMappings = {
        'Admin': permissions.map(p => p.id),
        'Teacher': permissions
          .filter(p => [
            'student.view',
            'ep.view',
            'attendance.view',
            'attendance.mark',
            'attendance.edit',
            'report.view_general',
            'ep.manage_enrollment'
          ].includes(p.name))
          .map(p => p.id),
        'Supervisor': permissions
          .filter(p => [
            'student.view',
            'ep.view',
            'ep.edit',
            'ep.assign_teacher',
            'attendance.view',
            'attendance.report',
            'report.view_general',
            'report.view_detailed',
            'report.export'
          ].includes(p.name))
          .map(p => p.id),
        'AttendanceTaker': permissions
          .filter(p => [
            'attendance.view',
            'attendance.mark',
            'attendance.edit',
            'attendance.report',
            'student.view',
            'ep.view'
          ].includes(p.name))
          .map(p => p.id)
      };

      for (const [roleName, permissionIds] of Object.entries(rolePermissionMappings)) {
        const roleId = roles.find(r => r.name === roleName).id;
        const rolePermissions = permissionIds.map(permissionId => ({
          role_id: roleId,
          permission_id: permissionId,
          created_at: new Date(),
          updated_at: new Date()
        }));

        await queryInterface.bulkInsert('role_permissions', rolePermissions, { transaction });
      }

      // 6. Create user-role mappings
      console.log('Creating user-role mappings...');
      const userRoleMappings = [
        { email: 'admin@asyv.com', role: 'Admin' },
        { email: 'teacher@asyv.com', role: 'Teacher' },
        { email: 'supervisor@asyv.com', role: 'Supervisor' },
        { email: 'attendance@asyv.com', role: 'AttendanceTaker' }
      ];

      const userRoles = userRoleMappings.map(mapping => ({
        user_id: users.find(u => u.email === mapping.email).id,
        role_id: roles.find(r => r.name === mapping.role).id,
        created_at: new Date(),
        updated_at: new Date()
      }));

      await queryInterface.bulkInsert('user_roles', userRoles, { transaction });

      await transaction.commit();
      console.log('Seeding completed successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('Error in seeding:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Delete in reverse order of creation
      await queryInterface.bulkDelete('user_roles', null, { transaction });
      await queryInterface.bulkDelete('role_permissions', null, { transaction });
      await queryInterface.bulkDelete('users', null, { transaction });
      await queryInterface.bulkDelete('roles', null, { transaction });
      await queryInterface.bulkDelete('permissions', null, { transaction });

      await transaction.commit();
      console.log('Rollback completed successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('Error in rollback:', error);
      throw error;
    }
  }
};