import { UserRole } from '@/types/userRole'

export const navRoutes: Record<UserRole, { name: string; path: string }[]> = {
  [UserRole.ADMIN]: [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Users', path: '/admin/users' },
    { name: 'Settings', path: '/admin/settings' },
    { name: 'Reports', path: '/admin/reports' }
  ],
  [UserRole.STUDENT]: [
    { name: 'Dashboard', path: '/student/dashboard' },
    { name: 'Courses', path: '/student/courses' },
    { name: 'Profile', path: '/student/profile' },
    { name: 'Grades', path: '/student/grades' }
  ],
  [UserRole.TEACHER]: [
    { name: 'Dashboard', path: '/teacher/dashboard' },
    { name: 'Classes', path: '/teacher/classes' },
    { name: 'Assignments', path: '/teacher/assignments' },
    { name: 'Profile', path: '/teacher/profile' }
  ],
  [UserRole.STAFF]: [
    { name: 'Dashboard', path: '/staff/dashboard' },
    { name: 'Resources', path: '/staff/resources' },
    { name: 'Reports', path: '/staff/reports' },
    { name: 'Profile', path: '/staff/profile' }
  ]
}
