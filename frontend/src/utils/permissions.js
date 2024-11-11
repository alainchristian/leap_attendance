// src/utils/permissions.js

export const PERMISSIONS = {
    // User Management
    USER_VIEW: 'user.view',
    USER_CREATE: 'user.create',
    USER_EDIT: 'user.edit',
    USER_DELETE: 'user.delete',
  
    // Student Management
    STUDENT_VIEW: 'student.view',
    STUDENT_CREATE: 'student.create',
    STUDENT_EDIT: 'student.edit',
    STUDENT_DELETE: 'student.delete',
  
    // EP Management
    EP_VIEW: 'ep.view',
    EP_CREATE: 'ep.create',
    EP_EDIT: 'ep.edit',
    EP_DELETE: 'ep.delete',
    EP_ASSIGN_TEACHER: 'ep.assign_teacher',
    EP_MANAGE_ENROLLMENT: 'ep.manage_enrollment',
  
    // Attendance
    ATTENDANCE_VIEW: 'attendance.view',
    ATTENDANCE_MARK: 'attendance.mark',
    ATTENDANCE_EDIT: 'attendance.edit',
    ATTENDANCE_REPORT: 'attendance.report',
  
    // Reports
    REPORT_VIEW_GENERAL: 'report.view_general',
    REPORT_VIEW_DETAILED: 'report.view_detailed',
    REPORT_EXPORT: 'report.export',
  
    // Academic Year
    ACADEMIC_VIEW: 'academic.view',
    ACADEMIC_MANAGE: 'academic.manage',
    ROTATION_VIEW: 'rotation.view',
    ROTATION_MANAGE: 'rotation.manage',
  
    // Family Management
    FAMILY_VIEW: 'family.view',
    FAMILY_CREATE: 'family.create',
    FAMILY_EDIT: 'family.edit',
    FAMILY_DELETE: 'family.delete',
  
    // Center Management
    CENTER_VIEW: 'center.view',
    CENTER_EDIT: 'center.edit',
    CENTER_MANAGE: 'center.manage'
  };
  
  export const ROLE_PERMISSIONS = {
    Admin: Object.values(PERMISSIONS), // Admin gets all permissions
  
    Teacher: [
      PERMISSIONS.STUDENT_VIEW,
      PERMISSIONS.EP_VIEW,
      PERMISSIONS.ATTENDANCE_VIEW,
      PERMISSIONS.ATTENDANCE_MARK,
      PERMISSIONS.ATTENDANCE_EDIT,
      PERMISSIONS.REPORT_VIEW_GENERAL,
      PERMISSIONS.EP_MANAGE_ENROLLMENT,
      PERMISSIONS.FAMILY_VIEW,
      PERMISSIONS.CENTER_VIEW
    ],
  
    Supervisor: [
      PERMISSIONS.STUDENT_VIEW,
      PERMISSIONS.EP_VIEW,
      PERMISSIONS.EP_EDIT,
      PERMISSIONS.EP_ASSIGN_TEACHER,
      PERMISSIONS.ATTENDANCE_VIEW,
      PERMISSIONS.ATTENDANCE_REPORT,
      PERMISSIONS.REPORT_VIEW_GENERAL,
      PERMISSIONS.REPORT_VIEW_DETAILED,
      PERMISSIONS.REPORT_EXPORT,
      PERMISSIONS.FAMILY_VIEW,
      PERMISSIONS.ROTATION_VIEW,
      PERMISSIONS.CENTER_VIEW,
      PERMISSIONS.CENTER_EDIT
    ],
  
    AttendanceTaker: [
      PERMISSIONS.STUDENT_VIEW,
      PERMISSIONS.EP_VIEW,
      PERMISSIONS.ATTENDANCE_VIEW,
      PERMISSIONS.ATTENDANCE_MARK,
      PERMISSIONS.ATTENDANCE_EDIT,
      PERMISSIONS.ATTENDANCE_REPORT,
      PERMISSIONS.FAMILY_VIEW,
      PERMISSIONS.REPORT_VIEW_GENERAL,
      PERMISSIONS.CENTER_VIEW
    ]
  };
  
  // Helper functions for permission checking
  export const hasPermission = (userRoles = [], permission) => {
    if (!permission) return true;
    if (!userRoles.length) return false;
  
    // Check if user has Admin role
    if (userRoles.includes('Admin')) return true;
  
    // Check if any of the user's roles have the required permission
    return userRoles.some(roleName => {
      const rolePermissions = ROLE_PERMISSIONS[roleName] || [];
      return rolePermissions.includes(permission);
    });
  };
  
  export const hasAnyPermission = (userRoles = [], permissions = []) => {
    return userRoles.includes('Admin') || 
           permissions.some(permission => hasPermission(userRoles, permission));
  };
  
  export const hasAllPermissions = (userRoles = [], permissions = []) => {
    return userRoles.includes('Admin') || 
           permissions.every(permission => hasPermission(userRoles, permission));
  };
  
  // Function to get all permissions for a role
  export const getRolePermissions = (roleName) => {
    return ROLE_PERMISSIONS[roleName] || [];
  };
  
  // Function to check if a role exists
  export const isValidRole = (roleName) => {
    return Object.keys(ROLE_PERMISSIONS).includes(roleName);
  };
  
  // Function to get permission description
  export const getPermissionDescription = (permission) => {
    const descriptions = {
      'user.view': 'View user details and list',
      'user.create': 'Create new users',
      'user.edit': 'Edit existing users',
      'user.delete': 'Delete users',
      // Add more descriptions as needed
    };
    return descriptions[permission] || permission;
  };
  
  export default {
    PERMISSIONS,
    ROLE_PERMISSIONS,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getRolePermissions,
    isValidRole,
    getPermissionDescription
  };