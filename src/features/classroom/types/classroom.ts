import { ClassroomStatus } from '@/types/enum'

export type Classroom = {
  id: number
  name: string
  grade: string
  description: string
  createdAt: string
  updatedAt: string
  startDate: string
  endDate: string
  teacherId: string
  classCode: string
  coverImageUrl: string | null
  status: ClassroomStatus
  numberOfStudents: number
  resourceIds: string[]
  students: StudentClassroom[]
}

export type StudentClassroom = {
  id: string
  studentName: string
  studentEmail: string
  studentImageUrl: string
}
