import { UserRole } from '@/types/userRole'

export const navRoutes: Record<UserRole, { name: string; path: string }[]> = {
  [UserRole.ADMIN]: [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Users', path: '/admin/users' },
    { name: 'Settings', path: '/admin/settings' }
  ],
  [UserRole.STUDENT]: [
    { name: 'Home', path: '/' },
    { name: 'Resources', path: '/resources' },
    { name: 'Classroom', path: '/classroom' },
    { name: 'STEM', path: '/stem' }
  ],
  [UserRole.TEACHER]: [
    { name: 'Home', path: '/' },
    { name: 'Resources', path: '/resources' },
    { name: 'Classroom', path: '/classroom' },
    { name: 'STEM', path: '/stem' }
  ],
  [UserRole.STAFF]: [
    { name: 'Home', path: '/' },
    { name: 'Resources', path: '/resources' }
  ],
  [UserRole.GUEST]: [
    { name: 'Home', path: '/' },
    { name: 'Resources', path: '/resources' },
    { name: 'Classroom', path: '/classroom' },
    { name: 'STEM', path: '/stem' }
  ]
}
