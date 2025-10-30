import { UserRole } from '@/types/userRole'

export const navRoutes: Record<UserRole, { name: string; path: string }[]> = {
  [UserRole.ADMIN]: [
    { name: 'home', path: '/' },
    { name: 'resources', path: '/resource' },
    { name: 'dashboard', path: '/admin/dashboard' }
  ],
  [UserRole.STUDENT]: [
    { name: 'home', path: '/' },
    { name: 'resources', path: '/resource' },
    { name: 'classroom', path: '/classroom' },
    { name: 'myLearning', path: '/my-learning' },
    { name: 'strawLab', path: '/straw-lab' }
  ],
  [UserRole.TEACHER]: [
    { name: 'home', path: '/' },
    { name: 'resources', path: '/resource' },
    { name: 'classroom', path: '/classroom' },
    { name: 'strawLab', path: '/straw-lab' }
  ],
  [UserRole.STAFF]: [
    { name: 'home', path: '/' },
    { name: 'resources', path: '/resource' },
    { name: 'strawLab', path: '/straw-lab' }
  ],
  [UserRole.GUEST]: [
    { name: 'home', path: '/' },
    { name: 'resources', path: '/resource' },
    { name: 'shop', path: '/shop' }
    // { name: 'strawLab', path: '/straw-lab' }
  ]
}
