import { Curriculum } from '@/features/resource/curriculum/types/curriculum.type'
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
  }
  classCode: string
  status: ClassroomStatus
  numberOfStudents: number
  students: any[]
  curriculum: Pick<Curriculum, 'id' | 'title' | 'description' | 'imageUrl' | 'courseCount' | 'code'>
}

export type ClassroomQueryParams = {
  status?: ClassroomStatus
} & SearchPaginatedRequestParams

// Pending, InProgress, Completed, Deleted
export enum ClassroomStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'InProgress',
  COMPLETED = 'Completed',
  DELETED = 'Deleted'
}
