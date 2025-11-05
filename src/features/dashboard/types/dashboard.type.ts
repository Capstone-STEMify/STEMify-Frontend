import { SearchPaginatedRequestParams } from "@/types/baseModel";

export type DashboardStatistics = {
  totalCurriculum: number;
  totalClassrooms: number;
  totalStudents: number;
  totalTeachers: number;
  totalUsers: number;
  totalCurriculumEnrollments: number;
  totalCurriculumCertificates: number;
  passRate: number;
  change: ChangeStatistics;
  curriculumStatistic: CurriculumStatistic[];
  classroomStatistic: ClassroomStatistic[];
}

export type ChangeStatistics = {
  totalCurriculum: number;
  totalClassrooms: number;
  totalStudents: number;
  totalTeachers: number;
  totalCurriculumEnrollments: number;
  totalCurriculumCertificates: number;
  passRate: number;
}

export type CurriculumStatistic = {
  id: number;
  title: string;
  imageUrl: string;
  courseCount: number;
  passRate: number;
  totalEnrollment: number;
}

export type ClassroomStatistic = {
  id: number;
  name: string;
  passRate: number;
  averageScore: number;
}

export type DashboardStatisticQueryParam = {
  organizationId: number
} & SearchPaginatedRequestParams
