import { ApiResponse } from '@/types/baseModel'


export type SystemDashboardData = {
  summary: DashboardSummary
  subscriptions: SubscriptionStats
  enrollments: EnrollmentStats
  topCourses: TopCourse[]
  topOrganizations: TopOrganization[]
  periodComparison: PeriodComparison
}

export type DashboardSummary = {
  totalOrganizations: number
  totalEnrollments: number
  totalStudents: number
  totalTeachers: number
  totalClassrooms: number
  totalCertificates: number
  overallPassRate: number
  activeOrganizations: number
}

export type SubscriptionStats = {
  totalSubscriptions: number
  activeSubscriptions: number
  expiredSubscriptions: number
  byPlan: PlanStat[]
  totalRevenue: number
}

export type TopCourse = {
  courseId: number
  courseCode: string
  courseName: string
  totalEnrollments: number
  completionRate: number
  averageScore: number
  totalClassrooms: number
}

export type PlanStat = {
  planName: string
  count: number
  revenue: number
  activeCount: number
}

export type EnrollmentStats = {
  totalEnrollments: number
  completedEnrollments: number
  inProgressEnrollments: number
  enrollmentsByMonth: any[]
  completionRate: number
}

export type TopOrganization = {
  organizationId: number
  organizationName: string
  totalStudents: number
  totalEnrollments: number
  passRate: number
  activeSubscriptions: number
}

export type PeriodComparison = {
  organizationGrowth: number
  enrollmentGrowth: number
  studentGrowth: number
  revenueGrowth: number
}

export type SystemDashboardQueryParams = {
  period: 'Month' | 'Quarter' | 'Year'
}