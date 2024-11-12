import React, { Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/auth.context';
import DashboardLayout from '../layouts/DashboardLayout';
import LoginPage from '../pages/auth/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import UnauthorizedPage from '../components/error/Unauthorized';
import { PERMISSIONS } from '../utils/permissions';

// Import pages directly
import Users from '../pages/users/Users';
import {Families} from '../pages/families/Families';
import {CreateFamily} from '../pages/families/CreateFamily';
import {Students} from '../pages/students/Students';
import {StudentDetails} from '../pages/students/StudentDetails';
import {CreateStudent} from '../pages/students/CreateStudent';
import {StudentGroups} from '../pages/students/StudentGroups';
import {Programs} from '../pages/programs/Programs';
import {ProgramDetails} from '../pages/programs/ProgramDetails';
import {CreateProgram} from '../pages/programs/CreateProgram';
import {CurrentRotation} from '../pages/rotations/CurrentRotation';
import {RotationSchedule} from '../pages/rotations/RotationSchedule';
import {ManageRotations} from '../pages/rotations/ManageRotations';
import {Attendance} from '../pages/attendance/Attendance';
import {AttendanceRecords} from '../pages/attendance/AttendanceRecords';
import {AttendanceReports} from '../pages/attendance/AttendanceReports';
import {Reports} from '../pages/reports/Reports';
import {ExportData} from '../pages/reports/ExportData';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-asyv-green" />
  </div>
);

const ProtectedRoute = ({ element: Element, permission, permissions, requireAll = false }) => {
  const { 
    isAuthenticated, 
    loading, 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions,
    isAdmin,
    user 
  } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login'); // Debug log
    return <Navigate to="/login" replace />;
  }

  // Special case for admin users - they have access to everything
  if (isAdmin()) {
    console.log('User is admin, granting access'); // Debug log
    return <Element />;
  }

  // Check specific permission
  if (permission) {
    console.log('Checking permission for route:', { 
      permission, 
      user,
      roles: user?.roles,
      permissions: user?.roles?.flatMap(r => r.permissions?.map(p => p.name) || [])
    }); // Debug log

    if (!hasPermission(permission)) {
      console.log('Permission denied:', permission); // Debug log
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check multiple permissions
  if (permissions) {
    const hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);

    console.log('Checking multiple permissions:', { 
      permissions, 
      requireAll, 
      hasAccess,
      user,
      roles: user?.roles,
      userPermissions: user?.roles?.flatMap(r => r.permissions?.map(p => p.name) || [])
    }); // Debug log

    if (!hasAccess) {
      console.log('Multiple permissions check failed'); // Debug log
      return <Navigate to="/unauthorized" replace />;
    }
  }

  console.log('Access granted to route'); // Debug log
  return <Element />;
};

const AppRoutes = () => {
  const { isAuthenticated, login } = useAuth();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <LoginPage onLogin={handleLogin} />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Routes - All wrapped in DashboardLayout */}
      <Route element={<DashboardLayout><Outlet /></DashboardLayout>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Family Routes */}
        <Route path="/families">
          <Route 
            index 
            element={
              <ProtectedRoute 
                element={Families} 
                permission={PERMISSIONS.FAMILY_VIEW} 
              />
            } 
          />
          <Route 
            path="create" 
            element={
              <ProtectedRoute 
                element={CreateFamily} 
                permission={PERMISSIONS.FAMILY_CREATE} 
              />
            } 
          />
        </Route>

        {/* Student Routes */}
        <Route path="/students">
          <Route 
            index 
            element={
              <ProtectedRoute 
                element={Students} 
                permission={PERMISSIONS.STUDENT_VIEW} 
              />
            } 
          />
          <Route 
            path=":id" 
            element={
              <ProtectedRoute 
                element={StudentDetails} 
                permission={PERMISSIONS.STUDENT_VIEW} 
              />
            } 
          />
          <Route 
            path="create" 
            element={
              <ProtectedRoute 
                element={CreateStudent} 
                permission={PERMISSIONS.STUDENT_CREATE} 
              />
            } 
          />
          <Route 
            path="groups" 
            element={
              <ProtectedRoute 
                element={StudentGroups} 
                permission={PERMISSIONS.STUDENT_EDIT} 
              />
            } 
          />
        </Route>

        {/* EP Programs Routes */}
        <Route path="/programs">
          <Route 
            path="sports" 
            element={
              <ProtectedRoute 
                element={() => <Programs type="sports" />} 
                permission={PERMISSIONS.EP_VIEW} 
              />
            } 
          />
          <Route 
            path="arts" 
            element={
              <ProtectedRoute 
                element={() => <Programs type="arts" />} 
                permission={PERMISSIONS.EP_VIEW} 
              />
            } 
          />
          <Route 
            path="science" 
            element={
              <ProtectedRoute 
                element={() => <Programs type="science" />} 
                permission={PERMISSIONS.EP_VIEW} 
              />
            } 
          />
          <Route 
            path="create" 
            element={
              <ProtectedRoute 
                element={CreateProgram} 
                permission={PERMISSIONS.EP_CREATE} 
              />
            } 
          />
          <Route 
            path=":id" 
            element={
              <ProtectedRoute 
                element={ProgramDetails} 
                permission={PERMISSIONS.EP_VIEW} 
              />
            } 
          />
        </Route>

        {/* EP Rotations Routes */}
        <Route path="/rotations">
          <Route 
            path="current" 
            element={
              <ProtectedRoute 
                element={CurrentRotation} 
                permission={PERMISSIONS.ACADEMIC_VIEW} 
              />
            } 
          />
          <Route 
            path="schedule" 
            element={
              <ProtectedRoute 
                element={RotationSchedule} 
                permission={PERMISSIONS.ACADEMIC_VIEW} 
              />
            } 
          />
          <Route 
            path="manage" 
            element={
              <ProtectedRoute 
                element={ManageRotations} 
                permission={PERMISSIONS.ACADEMIC_MANAGE} 
              />
            } 
          />
        </Route>

        {/* Attendance Routes */}
        <Route path="/attendance">
          <Route 
            path="take" 
            element={
              <ProtectedRoute 
                element={Attendance} 
                permission={PERMISSIONS.ATTENDANCE_MARK} 
              />
            } 
          />
          <Route 
            path="records" 
            element={
              <ProtectedRoute 
                element={AttendanceRecords} 
                permission={PERMISSIONS.ATTENDANCE_VIEW} 
              />
            } 
          />
          <Route 
            path="reports" 
            element={
              <ProtectedRoute 
                element={AttendanceReports} 
                permission={PERMISSIONS.ATTENDANCE_REPORT} 
              />
            } 
          />
        </Route>

        {/* Reports Routes */}
        <Route path="/reports">
          <Route 
            path="attendance" 
            element={
              <ProtectedRoute 
                element={() => <Reports type="attendance" />} 
                permission={PERMISSIONS.REPORT_VIEW_GENERAL} 
              />
            } 
          />
          <Route 
            path="programs" 
            element={
              <ProtectedRoute 
                element={() => <Reports type="programs" />} 
                permission={PERMISSIONS.REPORT_VIEW_GENERAL} 
              />
            } 
          />
          <Route 
            path="students" 
            element={
              <ProtectedRoute 
                element={() => <Reports type="students" />} 
                permission={PERMISSIONS.REPORT_VIEW_GENERAL} 
              />
            } 
          />
          <Route 
            path="export" 
            element={
              <ProtectedRoute 
                element={ExportData} 
                permission={PERMISSIONS.REPORT_EXPORT} 
              />
            } 
          />
        </Route>

        {/* Settings Routes */}
        <Route path="/settings">
          <Route
            path="users"
            element={
              <ProtectedRoute 
                element={Users}
                permissions={['user.view', 'user.edit']} // Allow either permission
                requireAll={false} // Only need one of the permissions
              />
            }
          />
        </Route>

        {/* Catch all route - 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;