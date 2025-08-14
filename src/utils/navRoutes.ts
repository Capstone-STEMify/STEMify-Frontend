import { UserRole } from '@/types/userRole'

export const navRoutes: Record<UserRole, { name: string; path: string }[]> = {
  [UserRole.ADMIN]: [
    { name: 'home', path: '/' },
    { name: 'resources', path: '/resource' },
    { name: 'dashboard', path: '/dashboard' }
  ],
  [UserRole.STUDENT]: [
    { name: 'home', path: '/' },
    { name: 'resources', path: '/resource' },
    { name: 'myLearning', path: '/my-learning' },
    { name: 'codelab', path: '/code-lab' }
  ],
  [UserRole.TEACHER]: [
    { name: 'home', path: '/' },
    { name: 'resources', path: '/resource' },
    { name: 'myLearning', path: '/my-learning' },
    { name: 'codelab', path: '/code-lab' }
  ],
  [UserRole.STAFF]: [
    { name: 'home', path: '/' },
    { name: 'resources', path: '/resource' },
    { name: 'codelab', path: '/code-lab' }
  ],
  [UserRole.GUEST]: [
    { name: 'home', path: '/' },
    { name: 'resources', path: '/resource' },
    { name: 'myLearning', path: '/my-learning' },
    { name: 'codelab', path: '/code-lab' }
  ]
}
