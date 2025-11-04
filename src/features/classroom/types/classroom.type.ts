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
  status?: ClassroomStatus
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
