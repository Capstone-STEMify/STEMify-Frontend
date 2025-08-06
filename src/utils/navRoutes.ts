import { UserRole } from '@/types/userRole'

export const navRoutes: Record<UserRole, { name: string; path: string }[]> = {
  [UserRole.ADMIN]: [
    { name: 'Home', path: '/' },
    { name: 'Resource', path: '/resource' },
    { name: 'Dashboard', path: '/dashboard' }
  ],
  [UserRole.STUDENT]: [
    { name: 'Home', path: '/' },
    { name: 'Resource', path: '/resource' },
    { name: 'My Learning', path: '/my-learning' },
    { name: 'Code Lab', path: '/code-lab' }
  ],
  [UserRole.TEACHER]: [
    { name: 'Home', path: '/' },
    { name: 'Resource', path: '/resource' },
    { name: 'My Learning', path: '/my-learning' },
    { name: 'Code Lab', path: '/code-lab' }
  ],
  [UserRole.STAFF]: [
    { name: 'Home', path: '/' },
    { name: 'Resource', path: '/resource' },
    { name: 'Code Lab', path: '/code-lab' }
  ],
  [UserRole.GUEST]: [
    { name: 'Home', path: '/' },
    { name: 'Resource', path: '/resource' },
    { name: 'My Learning', path: '/my-learning' },
    { name: 'Code Lab', path: '/code-lab' }
  ]
}
