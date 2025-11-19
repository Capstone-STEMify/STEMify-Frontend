import { SearchPaginatedRequestParams } from '@/types/baseModel'

export type DashboardResponse = {
  data: DashboardData
  isSucceeded: boolean
  message: string
  statusCode: number
}

export type DashboardData = {
  currentPeriod: PeriodStatistics
  previousPeriod: PeriodStatistics
  change: ChangeStatistics
  curriculumStatistics: CurriculumStatistic[]
  classroomStatistics: ClassroomStatistic[]
}

export type PeriodStatistics = {
  totalCurriculum: number
  totalClassrooms: number
  totalStudents: number
  totalTeachers: number
  totalUsers: number
  totalCurriculumEnrollments: number
  totalCurriculumCertificates: number
  passRate: number
}

export type ChangeStatistics = {
  totalCurriculum: number
  totalClassrooms: number
  totalStudents: number
  totalTeachers: number
  totalUsers: number
  totalCurriculumEnrollments: number
  totalCurriculumCertificates: number
  passRate: number
} // percentage change compared to previous period

export type CurriculumStatistic = {
  id: number
  title: string
  imageUrl: string
  courseCount: number
  passRate: number
  totalEnrollment: number
}

export type ClassroomStatistic = {
  id: number
  name: string
  passRate: number
  averageScore: number
  curriculumCode: string
  curriculumTitle: string
}

export type DashboardStatisticQueryParam = {
  organizationId: number
  period: string
} & SearchPaginatedRequestParams
