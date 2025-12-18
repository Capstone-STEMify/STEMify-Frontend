export enum UserRole {
  ADMIN = 'Admin',
  STAFF = 'Staff',
  GUEST = 'Guest',
  MEMBER = 'Member'
}

export enum LicenseType {
  ORGANIZATION_ADMIN = 'OrganizationAdmin',
  TEACHER = 'Teacher',
  STUDENT = 'Student'
}

export type HeaderRole = UserRole.GUEST | UserRole.ADMIN | UserRole.STAFF | LicenseType
export type EffectiveRole = UserRole.ADMIN | UserRole.STAFF | UserRole.GUEST | LicenseType
