// Permission constants
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

    // EP Management
    EP_VIEW: 'ep.view',
    EP_MANAGE: 'ep.manage',

    // Attendance
    ATTENDANCE_VIEW: 'attendance.view',
    ATTENDANCE_MARK: 'attendance.mark',

    // Reports
    REPORT_VIEW: 'report.view',
    REPORT_MANAGE: 'report.manage'
};

// Role constants
export const ROLES = {
    ADMIN: 'Admin',
    TEACHER: 'Teacher',
    SUPERVISOR: 'Supervisor'
};

// Helper functions
export const hasPermission = (user, permission) => {
    if (!user || !user.roles) return false;
    return user.roles.some(role => 
        role.permissions?.some(p => p.name === permission)
    );
};

export const hasRole = (user, roleName) => {
    if (!user || !user.roles) return false;
    return user.roles.some(role => role.name === roleName);
};

export const hasAnyPermission = (user, permissions) => {
    return permissions.some(permission => hasPermission(user, permission));
};

export const hasAllPermissions = (user, permissions) => {
    return permissions.every(permission => hasPermission(user, permission));
};