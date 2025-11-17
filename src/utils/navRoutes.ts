import { HeaderRole, LicenseType, UserRole } from '@/types/userRole'

export const navRoutes: Record<HeaderRole, { name: string; path: string }[]> = {
  [UserRole.GUEST]: [
    { name: 'home', path: '/' },
    { name: 'resources', path: '/resource' }
  ],
  [LicenseType.STUDENT]: [
    { name: 'home', path: '/' },
    { name: 'resources', path: '/resource' },
    { name: 'myLearning', path: '/my-learning' },
    { name: 'strawLab', path: '/lab' }
  ],
  [LicenseType.TEACHER]: [
    { name: 'home', path: '/' },
    { name: 'resources', path: '/resource' },
    { name: 'classroom', path: '/classroom' },
    { name: 'strawLab', path: '/lab' }
  ]
  // [UserRole.ADMIN]: [
  //   { name: 'home', path: '/' },
  //   { name: 'resources', path: '/resource' },
  //   { name: 'dashboard', path: '/admin/dashboard' }
  // ],
  // [UserRole.STAFF]: [
  //   { name: 'home', path: '/' },
  //   { name: 'resources', path: '/resource' },
  //   { name: 'strawLab', path: '/lab' }
  // ],

  // [UserRole.MEMBER]: [
  //   { name: 'home', path: '/' },
  //   { name: 'resources', path: '/resource' }
  // ],

  //   [LicenseType.ORGANIZATION_ADMIN]: [
  //     { name: 'home', path: '/' },
  //     { name: 'resources', path: '/resource' },
  //     { name: 'organizationDashboard', path: '/organization/dashboard' }
  //   ]
}
