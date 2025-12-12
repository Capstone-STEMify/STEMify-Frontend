import { Course } from '@/features/resource/course/types/course.type'
import { Curriculum } from '@/features/resource/curriculum/types/curriculum.type'
import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

export type Classroom = {
  id: number
  name: string
  grade: string
  description: string
  createdAt: string
  updatedAt: string
  startDate: string
  endDate: string
  teacher: {
    id: string
    name: string
    email: string
    imageUrl: string
    userName: string
  }
  classCode: string
  status: ClassroomStatus
  numberOfStudents: number
  students: {
    id: string
    name: string
    email: string
    imageUrl: string
  }[]
  course: Course
  // curriculum: Pick<Curriculum, 'id' | 'title' | 'description' | 'imageUrl' | 'courseCount' | 'code'>
  organizationSubscriptionOrderId: number
}

export type ClassroomSliceParams = {
  teacherId?: string
  status?: ClassroomStatus
  courseId?: number
  subscriptionId?: number
} & SliceQueryParams

// Pending, InProgress, Completed, Deleted
export enum ClassroomStatus {
  ALL = 'all', // for filter purpose
  PENDING = 'Pending',
  IN_PROGRESS = 'InProgress',
  UPCOMING = 'Upcoming',
  COMPLETED = 'Completed',
  DELETED = 'Deleted'
}

export enum Grade {
  GRADE_1 = 1,
  GRADE_2 = 2,
  GRADE_3 = 3,
  GRADE_4 = 4,
  GRADE_5 = 5,
  GRADE_6 = 6
}

export type SectionProgress = {
  id: number
  sectionId: number
  status: 'NotStarted' | 'InProgress' | 'Completed' | string
}

export type LessonProgress = {
  id: number
  lessonId: number
  status: string
  sectionProgresses: SectionProgress[]
}

export type StudentProgressItem = {
  studentId: string
  studentName: string
  courseEnrollmentId: number
  lessonProgresses: LessonProgress[]
}

export type LessonStructure = {
  lessonId: number
  lessonTitle: string
  sectionIds: number[]
}

export type StudentProgressData = {
  courseId: number
  classroomId: number
  lessons: LessonStructure[]
  StudentProgress: StudentProgressItem[]
}

export type StudentProgressParams = {
  classroomId: number
  courseId: number
}
// =============== CLASSROOM SCHEDULE TYPE ===============

export type ClassroomSchedule = {
  minutesPerWeek: number
  totalWeeks: number
  courseSchedule: CourseSchedule[]
}

export type CourseSchedule = {
  courseId: number
  courseTitle: string
  scheduleItems: ScheduleItem[]
}

export type ScheduleItem = {
  weekNumber: number
  lessonSchedule: LessonSchedule[]
}

export type LessonSchedule = {
  lessonId: number
  lessonTitle: string
  duration: number
}

// =============== CLASSROOM DASHBOARD TYPE ===============

export type Statistic = {
  averageScore: number
  submissions: number
  passRate: number
}

export type UngradedAssignment = {
  studentAssignmentId: number
  studentName: string
  assignmentTitle: string
}

export type BoxPlotStats = {
  mean: number
  median: number
  min: number
  max: number
  q1: number
  q3: number
  outliers: number[]
}

export type CourseStat = {
  id: number
  name: string
  quizStats: BoxPlotStats
  assignmentStats: BoxPlotStats
  studentScoreHistogram: StudentScoreHistogram
}

export type HistogramBin = {
  rangeStart: number
  rangeEnd: number
  count: number
}

export type StudentScoreHistogram = {
  bins: HistogramBin[]
  totalStudents: number
}

export type ClassroomStatisticData = {
  quizStatistic: Statistic
  assignmentStatistic: Statistic
  ungradedAssignments: UngradedAssignment[]
  courseStats: CourseStat
}

// =============== STUDENT CLASSROOM DETAIL TYPE ===============
export interface StudentDetailResponse {
  studentId: string
  studentName: string
  studentEmail: string
  studentImageUrl: string
  courseEnrollmentStatus: 'InProgress' | 'Enrolled' | 'NotEnrolled'
  averageAssignmentScore: number
  averageQuizScore: number
  totalQuizzesTaken: number
  totalAssignmentsSubmitted: number
}

export type StudentClassroomParams = {
  classroomId: number
  studentId: string
}

// CREATE CLASSROOM
export type CreateClassroom = {
  grade: string
  courseId: number
  organizationSubscriptionOrderId: number
  description: string
  startDate: string
  endDate: string
  studentGroups: ClassroomStudentGroup[]
}

export type ClassroomStudentGroup = {
  groupCode: string
  groupName: string
  teacherId: string
  studentIds: string[]
}

// =============== AI ANALYSIS TYPES ===============

export type AiAnalysisRequest = {
  classroom_id: number
  force_mock: boolean
  analysis_period_days: number
}

export type AiStudentAnalysisResult = {
  studentId: string
  progressPercent: number
  currentStatus: string
  statusText: string
  currentSection: string | null
  interventionText: string
}

export type AiAnalysisResponse = {
  overviewText: string
  students: AiStudentAnalysisResult[]
  aiInsightsText: string
}
