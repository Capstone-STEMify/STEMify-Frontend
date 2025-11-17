import { User } from '@/features/user/types/user.type'
import { EffectiveRole, LicenseType, UserRole } from '@/types/userRole'
import { libraryBlocks } from 'blockly'

export const navRoutes: Record<EffectiveRole, { name: string; path: string }[]> = {
  [UserRole.ADMIN]: [
    { name: 'home', path: '/' },
    { name: 'resources', path: '/resource' },
    { name: 'dashboard', path: '/admin/dashboard' }
  ],
  [UserRole.STAFF]: [
    { name: 'home', path: '/' },
    { name: 'resources', path: '/resource' },
    { name: 'strawLab', path: '/lab' }
  ],
  [UserRole.GUEST]: [
    { name: 'home', path: '/' },
    { name: 'resources', path: '/resource' }
    // { name: 'shop', path: '/shop' }
    // { name: 'strawLab', path: '/lab' }
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
  ],
  [LicenseType.ORGANIZATION_ADMIN]: [
    { name: 'home', path: '/' },
    { name: 'resources', path: '/resource' },
    { name: 'organizationDashboard', path: '/organization/dashboard' }
  ]
}

export function resolveEffectiveRole(user?: User | null, organizationSubscriptionId?: number | null): EffectiveRole {
  if (!user) return UserRole.GUEST
  console.log('Resolving role for user:', user, 'with subscription ID:', organizationSubscriptionId)

  if (user.userRole === UserRole.MEMBER && organizationSubscriptionId) {
    for (const org of user.organizations ?? []) {
      const matchingSub = org.subscriptions.find((s) => s.id === organizationSubscriptionId)
      console.log('Matching subscription:', matchingSub)
      if (matchingSub?.isActive) {
        return matchingSub.role as EffectiveRole
      }
    }
    // fallback nếu không tìm thấy subscription
    return LicenseType.STUDENT
  }

  return user.userRole as EffectiveRole
}
