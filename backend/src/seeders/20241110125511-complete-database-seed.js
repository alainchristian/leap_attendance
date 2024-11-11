'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Step 1: Clean all tables
      console.log('Cleaning existing data...');
      await queryInterface.bulkDelete('ep_attendance', null, { transaction });
      await queryInterface.bulkDelete('ep_registrations', null, { transaction });
      await queryInterface.bulkDelete('ep_offerings', null, { transaction });
      await queryInterface.bulkDelete('ep_rotations', null, { transaction });
      await queryInterface.bulkDelete('enrichment_programs', null, { transaction });
      await queryInterface.bulkDelete('ep_centers', null, { transaction });
      await queryInterface.bulkDelete('student_profiles', null, { transaction });
      await queryInterface.bulkDelete('family_profiles', null, { transaction });
      await queryInterface.bulkDelete('role_permissions', null, { transaction });
      await queryInterface.bulkDelete('user_roles', null, { transaction });
      await queryInterface.bulkDelete('permissions', null, { transaction });
      await queryInterface.bulkDelete('roles', null, { transaction });
      await queryInterface.bulkDelete('users', null, { transaction });
      await queryInterface.bulkDelete('academic_years', null, { transaction });

      // Step 2: Create EP Centers
      console.log('Creating EP Centers...');
      await queryInterface.bulkInsert('ep_centers', [
        {
          center_name: 'Sports Center',
          center_description: 'Physical activities and sports programs',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          center_name: 'Arts Center',
          center_description: 'Creative and performing arts programs',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          center_name: 'Science Center',
          center_description: 'Science and technology programs',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ], { transaction });

      // Step 3: Create Permissions with improved structure
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

        // Family Management
        { name: 'family.view', description: 'View families', module: 'families' },
        { name: 'family.create', description: 'Create families', module: 'families' },
        { name: 'family.edit', description: 'Edit families', module: 'families' },
        { name: 'family.delete', description: 'Delete families', module: 'families' },

        // EP Management
        { name: 'ep.view', description: 'View EP programs', module: 'programs' },
        { name: 'ep.create', description: 'Create new EP programs', module: 'programs' },
        { name: 'ep.edit', description: 'Edit EP programs', module: 'programs' },
        { name: 'ep.delete', description: 'Delete EP programs', module: 'programs' },
        { name: 'ep.assign_teacher', description: 'Assign teachers to EP programs', module: 'programs' },
        { name: 'ep.manage_enrollment', description: 'Manage student enrollment in EP', module: 'programs' },

        // Center Management
        { name: 'center.view', description: 'View centers', module: 'centers' },
        { name: 'center.create', description: 'Create centers', module: 'centers' },
        { name: 'center.edit', description: 'Edit centers', module: 'centers' },
        { name: 'center.delete', description: 'Delete centers', module: 'centers' },

        // Attendance Management
        { name: 'attendance.view', description: 'View attendance records', module: 'attendance' },
        { name: 'attendance.mark', description: 'Mark student attendance', module: 'attendance' },
        { name: 'attendance.edit', description: 'Edit attendance records', module: 'attendance' },
        { name: 'attendance.report', description: 'Generate attendance reports', module: 'attendance' },

        // Reports
        { name: 'report.view_general', description: 'View general reports', module: 'reports' },
        { name: 'report.view_detailed', description: 'View detailed reports', module: 'reports' },
        { name: 'report.export', description: 'Export reports', module: 'reports' },
        { name: 'report.generate', description: 'Generate new reports', module: 'reports' },

        // Academic Year Management
        { name: 'academic.view', description: 'View academic years', module: 'academic' },
        { name: 'academic.manage', description: 'Manage academic years', module: 'academic' },
        { name: 'rotation.view', description: 'View rotations', module: 'academic' },
        { name: 'rotation.manage', description: 'Manage rotations', module: 'academic' }
      ].map(p => ({
        ...p,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }));

      await queryInterface.bulkInsert('permissions', permissionsList, { transaction });

      // Step 4: Create improved roles
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
        },
        {
          name: 'CenterManager',
          description: 'Manages specific EP centers',
        }
      ].map(r => ({
        ...r,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }));

      await queryInterface.bulkInsert('roles', rolesList, { transaction });

      // Now part 2 starts here...
      // Step 5: Create initial users
      console.log('Creating users...');
      const hashedPassword = await bcrypt.hash('password123', 10);
      const usersList = [
        {
          first_name: 'Admin',
          last_name: 'User',
          email: 'admin@asyv.com',
          gender: 'Male',
          is_active: true
        },
        {
          first_name: 'John',
          last_name: 'Teacher',
          email: 'teacher@asyv.com',
          gender: 'Male',
          is_active: true
        },
        {
          first_name: 'Sarah',
          last_name: 'Supervisor',
          email: 'supervisor@asyv.com',
          gender: 'Female',
          is_active: true
        },
        {
          first_name: 'Mark',
          last_name: 'Attendance',
          email: 'attendance@asyv.com',
          gender: 'Male',
          is_active: true
        },
        {
          first_name: 'Emma',
          last_name: 'Center',
          email: 'center@asyv.com',
          gender: 'Female',
          is_active: true
        }
      ].map(u => ({
        ...u,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date()
      }));

      await queryInterface.bulkInsert('users', usersList, { transaction });

      // Step 6: Create family profiles
      console.log('Creating family profiles...');
      const familyList = [
        {
          family_name: 'Inkesha Family',
          family_mama: 'Mama Janet',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          family_name: 'Urugo Family',
          family_mama: 'Mama Sarah',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          family_name: 'Ubumwe Family',
          family_mama: 'Mama Grace',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      await queryInterface.bulkInsert('family_profiles', familyList, { transaction });

      // Step 7: Create academic year and rotations
      console.log('Creating academic year...');
      await queryInterface.bulkInsert('academic_years', [{
        year_name: '2023-2024',
        start_date: new Date('2023-09-01'),
        end_date: new Date('2024-06-30'),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }], { transaction });

      // Step 8: Get IDs for mapping
      const [roleRows] = await queryInterface.sequelize.query(
        'SELECT id, name FROM roles',
        { transaction }
      );

      const [permissionRows] = await queryInterface.sequelize.query(
        'SELECT id, name FROM permissions',
        { transaction }
      );

      const [userRows] = await queryInterface.sequelize.query(
        'SELECT id, email FROM users',
        { transaction }
      );

      // Step 9: Create role-permission mappings
      console.log('Creating role-permission mappings...');
      const rolePermissionMappings = {
        'Admin': permissionRows.map(p => p.id), // Admin gets all permissions
        'Teacher': permissionRows
          .filter(p => [
            'student.view',
            'ep.view',
            'attendance.view',
            'attendance.mark',
            'attendance.edit',
            'report.view_general',
            'ep.manage_enrollment',
            'family.view'
          ].includes(p.name))
          .map(p => p.id),
        'Supervisor': permissionRows
          .filter(p => [
            'student.view',
            'ep.view',
            'ep.edit',
            'ep.assign_teacher',
            'attendance.view',
            'attendance.report',
            'report.view_general',
            'report.view_detailed',
            'report.export',
            'center.view',
            'family.view',
            'rotation.view'
          ].includes(p.name))
          .map(p => p.id),
        'AttendanceTaker': permissionRows
          .filter(p => [
            'attendance.view',
            'attendance.mark',
            'attendance.edit',
            'attendance.report',
            'student.view',
            'ep.view',
            'family.view'
          ].includes(p.name))
          .map(p => p.id),
        'CenterManager': permissionRows
          .filter(p => [
            'center.view',
            'center.edit',
            'ep.view',
            'ep.edit',
            'ep.assign_teacher',
            'report.view_general'
          ].includes(p.name))
          .map(p => p.id)
      };

      for (const [roleName, permissionIds] of Object.entries(rolePermissionMappings)) {
        const roleId = roleRows.find(r => r.name === roleName).id;
        const rolePermissions = permissionIds.map(permissionId => ({
          role_id: roleId,
          permission_id: permissionId,
          created_at: new Date(),
          updated_at: new Date()
        }));

        await queryInterface.bulkInsert('role_permissions', rolePermissions, { transaction });
      }

      // Step 10: Create user-role mappings
      console.log('Creating user-role mappings...');
      const userRoleMappings = [
        { email: 'admin@asyv.com', role: 'Admin' },
        { email: 'teacher@asyv.com', role: 'Teacher' },
        { email: 'supervisor@asyv.com', role: 'Supervisor' },
        { email: 'attendance@asyv.com', role: 'AttendanceTaker' },
        { email: 'center@asyv.com', role: 'CenterManager' }
      ];

      const userRoles = userRoleMappings.map(mapping => ({
        user_id: userRows.find(u => u.email === mapping.email).id,
        role_id: roleRows.find(r => r.name === mapping.role).id,
        created_at: new Date(),
        updated_at: new Date()
      }));

      await queryInterface.bulkInsert('user_roles', userRoles, { transaction });

      await transaction.commit();
      console.log('Database seeding completed successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('Error in seeding:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Delete everything in reverse order
      await queryInterface.bulkDelete('ep_attendance', null, { transaction });
      await queryInterface.bulkDelete('ep_registrations', null, { transaction });
      await queryInterface.bulkDelete('ep_offerings', null, { transaction });
      await queryInterface.bulkDelete('ep_rotations', null, { transaction });
      await queryInterface.bulkDelete('enrichment_programs', null, { transaction });
      await queryInterface.bulkDelete('ep_centers', null, { transaction });
      await queryInterface.bulkDelete('student_profiles', null, { transaction });
      await queryInterface.bulkDelete('family_profiles', null, { transaction });
      await queryInterface.bulkDelete('role_permissions', null, { transaction });
      await queryInterface.bulkDelete('user_roles', null, { transaction });
      await queryInterface.bulkDelete('permissions', null, { transaction });
      await queryInterface.bulkDelete('roles', null, { transaction });
      await queryInterface.bulkDelete('users', null, { transaction });
      await queryInterface.bulkDelete('academic_years', null, { transaction });

      await transaction.commit();
      console.log('Seeder rollback completed successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('Error in rollback:', error);
      throw error;
    }
  }
};