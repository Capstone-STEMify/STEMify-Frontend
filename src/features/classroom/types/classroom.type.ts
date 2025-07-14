export enum ClassroomStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  ARCHIVED = 'Archived',
  DELETED = 'Deleted' //soft delete
}

export enum ClassroomOrderBy {
  NAME = 'name',
  CREATED_DATE = 'createdDate'
}

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
  coverImageUrl: string
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
