import { UserRole } from '@/types/userRole'

export const navRoutes: Record<UserRole, { name: string; path: string }[]> = {
  [UserRole.ADMIN]: [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Users', path: '/admin/users' },
    { name: 'Settings', path: '/admin/settings' }
  ],
  [UserRole.STUDENT]: [
    { name: 'Home', path: '/' },
    { name: 'Resource', path: '/resource' },
    { name: 'Classroom', path: '/classroom' },
    { name: 'Code Lab', path: '/code-lab' }
  ],
  [UserRole.TEACHER]: [
    { name: 'Home', path: '/' },
    { name: 'Resource', path: '/resource' },
    { name: 'Classroom', path: '/classroom' },
    { name: 'Code Lab', path: '/code-lab' }
  ],
  [UserRole.STAFF]: [
    { name: 'Home', path: '/' },
    { name: 'Resource', path: '/resource' }
  ],
  [UserRole.GUEST]: [
    { name: 'Home', path: '/' },
    { name: 'Resource', path: '/resource' },
    { name: 'Classroom', path: '/classroom' },
    { name: 'Code Lab', path: '/code-lab' }
  ]
}
