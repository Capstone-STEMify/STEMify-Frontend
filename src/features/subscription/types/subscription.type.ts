import { BillingCycle } from '@/features/plan/types/plan.type'

export type OrganizationSubscription = {
  id: number
  organizationId: number
  plan: string
  status: SubscriptionStatus
  pricePerSeat: number
  totalCurriculums: number
  totalSeats: number
  totalUsers: number
  startDate: string
  endDate: string
  billingCycle: BillingCycle
  organizationName: string
  organizationDescription?: string
  organizationImageUrl?: string
  organizationType: string
  organizationStatus: OrganizationStatus
}

export type AdminOrganization = {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

export enum OrganizationStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive'
}

export enum SubscriptionStatus {
  ACTIVE = 'Active',
  EXPIRED = 'Expired'
}
