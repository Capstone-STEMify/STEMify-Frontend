export type OrganizationSubscription = {
  id: number
  organizationId: number
  plan: string
  status: SubscriptionStatus
  price: number
  totalCurriculums: number
  totalSeats: number
  usedSeats: number
  StartDate: string
  EndDate: string
  billingCycle: BillingCycle
}

export type Organization = {
  id: number
  name: string
  description?: string
  imageUrl?: string
  organizationType: string
  createdAt: string
  updatedAt: string
  status: OrganizationStatus
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

export enum BillingCycle {
  YEARLY = '12 Months',
  SEMIANNUAL = '6 Months'
}
