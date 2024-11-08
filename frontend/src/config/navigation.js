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
  Bell
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
      name: 'Students',
      icon: Users,
      current: false,
      permission: 'view students',
      subItems: [
          { name: 'All Students', href: '/students', icon: Users, permission: 'view students' },
          { name: 'Add Student', href: '/students/create', icon: UserPlus, permission: 'create students' },
          { name: 'Student Groups', href: '/students/groups', icon: FolderOpen, permission: 'view students' }
      ]
  },
  {
      name: 'EP Programs',
      icon: GraduationCap,
      current: false,
      permission: 'view eps',
      subItems: [
          { name: 'Sports Programs', href: '/programs/sports', icon: Binary, permission: 'view eps' },
          { name: 'Arts Programs', href: '/programs/arts', icon: Library, permission: 'view eps' },
          { name: 'Science Programs', href: '/programs/science', icon: BookOpen, permission: 'view eps' },
          { name: 'Add Program', href: '/programs/create', icon: Pencil, permission: 'create eps' }
      ]
  },
  {
      name: 'EP Rotations',
      icon: Calendar,
      current: false,
      permission: 'view rotations',
      subItems: [
          { name: 'Current Rotation', href: '/rotations/current', icon: CalendarDays, permission: 'view rotations' },
          { name: 'Rotation Schedule', href: '/rotations/schedule', icon: Calendar, permission: 'view rotations' },
          { name: 'Manage Rotations', href: '/rotations/manage', icon: Settings, permission: 'manage rotations' }
      ]
  },
  {
      name: 'Attendance',
      icon: ClipboardCheck,
      current: false,
      permission: 'take attendance',
      subItems: [
          { name: 'Take Attendance', href: '/attendance/take', icon: ClipboardCheck, permission: 'take attendance' },
          { name: 'View Records', href: '/attendance/records', icon: FileText, permission: 'view attendance' },
          { name: 'Reports', href: '/attendance/reports', icon: BarChart, permission: 'view reports' }
      ]
  },
  {
      name: 'Reports',
      icon: BarChart,
      current: false,
      permission: 'view reports',
      subItems: [
          { name: 'Attendance Reports', href: '/reports/attendance', icon: ClipboardCheck, permission: 'view reports' },
          { name: 'Program Reports', href: '/reports/programs', icon: GraduationCap, permission: 'view reports' },
          { name: 'Student Reports', href: '/reports/students', icon: Users, permission: 'view reports' },
          { name: 'Export Data', href: '/reports/export', icon: FileText, permission: 'export reports' }
      ]
  },
  {
      name: 'Settings',
      icon: Settings,
      current: false,
      permission: 'manage settings',
      subItems: [
          { name: 'General Settings', href: '/settings', icon: Settings, permission: 'manage settings' },
          { name: 'User Management', href: '/settings/users', icon: Users, permission: 'manage users' },
          { name: 'Notifications', href: '/settings/notifications', icon: Bell, permission: 'manage settings' }
      ]
  }
];