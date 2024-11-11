// src/config/navigation.js
import {
    Home,
    Users,
    GraduationCap,
    Calendar,
    ClipboardCheck,
    BarChart,
    Settings,
    UserPlus,
    Pencil,
    FolderOpen,
    Library,
    Binary,
    BookOpen,
    CalendarDays,
    FileText,
    Bell,
    Building2,
    User,
    Shield,
    UserCog,
    Home as HomeIcon
} from 'lucide-react';

export const navigation = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: Home,
        current: true,
        permission: null // Everyone can access dashboard
    },
    {
        name: 'Family',
        icon: HomeIcon,
        current: false,
        permission: 'family.view',
        subItems: [
            { name: 'All Families', href: '/families', icon: Building2, permission: 'family.view' },
            { name: 'Add Family', href: '/families/create', icon: FolderOpen, permission: 'family.create' }
        ]
    },
    {
        name: 'Students',
        icon: Users,
        current: false,
        permission: 'student.view',
        subItems: [
            { name: 'All Students', href: '/students', icon: Users, permission: 'student.view' },
            { name: 'Add Student', href: '/students/create', icon: UserPlus, permission: 'student.create' },
            { name: 'Student Groups', href: '/students/groups', icon: FolderOpen, permission: 'student.edit' }
        ]
    },
    {
        name: 'EP Programs',
        icon: GraduationCap,
        current: false,
        permission: 'ep.view',
        subItems: [
            { name: 'Sports Programs', href: '/programs/sports', icon: Binary, permission: 'ep.view' },
            { name: 'Arts Programs', href: '/programs/arts', icon: Library, permission: 'ep.view' },
            { name: 'Science Programs', href: '/programs/science', icon: BookOpen, permission: 'ep.view' },
            { name: 'Add Program', href: '/programs/create', icon: Pencil, permission: 'ep.create' }
        ]
    },
    {
        name: 'EP Rotations',
        icon: Calendar,
        current: false,
        permission: 'academic.view',
        subItems: [
            { name: 'Current Rotation', href: '/rotations/current', icon: CalendarDays, permission: 'academic.view' },
            { name: 'Rotation Schedule', href: '/rotations/schedule', icon: Calendar, permission: 'academic.view' },
            { name: 'Manage Rotations', href: '/rotations/manage', icon: Settings, permission: 'academic.manage' }
        ]
    },
    {
        name: 'Attendance',
        icon: ClipboardCheck,
        current: false,
        permission: 'attendance.view',
        subItems: [
            { name: 'Take Attendance', href: '/attendance/take', icon: ClipboardCheck, permission: 'attendance.mark' },
            { name: 'View Records', href: '/attendance/records', icon: FileText, permission: 'attendance.view' },
            { name: 'Reports', href: '/attendance/reports', icon: BarChart, permission: 'attendance.report' }
        ]
    },
    {
        name: 'Reports',
        icon: BarChart,
        current: false,
        permission: 'report.view_general',
        subItems: [
            { name: 'Attendance Reports', href: '/reports/attendance', icon: ClipboardCheck, permission: 'report.view_general' },
            { name: 'Program Reports', href: '/reports/programs', icon: GraduationCap, permission: 'report.view_general' },
            { name: 'Student Reports', href: '/reports/students', icon: Users, permission: 'report.view_general' },
            { name: 'Export Data', href: '/reports/export', icon: FileText, permission: 'report.export' }
        ]
    },
    {
        name: 'System',
        icon: Settings,
        current: false,
        permission: 'user.view',
        subItems: [
            { name: 'User Management', href: '/settings/users', icon: User, permission: 'user.view' },
            { name: 'User Roles', href: '/settings/roles', icon: Shield, permission: 'user.view' },
            { name: 'User Permissions', href: '/settings/permissions', icon: UserCog, permission: 'user.view' },
            { name: 'General Settings', href: '/settings/general', icon: Settings, permission: 'academic.manage' },
            { name: 'Notifications', href: '/settings/notifications', icon: Bell, permission: 'report.view_general' }
        ]
    }
];