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
    Name: string
    Email: string
    ImageUrl: string
    userName: string
  }
  classCode: string
  status: ClassroomStatus
  numberOfStudents: number
  students: any[]
  curriculum: Pick<Curriculum, 'id' | 'title' | 'description' | 'imageUrl' | 'courseCount' | 'code'>
  organizationSubscriptionOrderId: number
}

export type ClassroomSliceParams = {
  teacherId?: string
  status?: 'upcoming' | 'inprogress' | 'completed' | 'endsoon'
} & SliceQueryParams

// Pending, InProgress, Completed, Deleted
export enum ClassroomStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'InProgress',
  COMPLETED = 'Completed',
  DELETED = 'Deleted'
}

export enum Grade {
  GRADE_1 = 'Grade 1',
  GRADE_2 = 'Grade 2',
  GRADE_3 = 'Grade 3',
  GRADE_4 = 'Grade 4',
  GRADE_5 = 'Grade 5',
  GRADE_6 = 'Grade 6'
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
