'use client'

import StudentClassroomDetail from '@/features/classroom/page/detail/StudentClassroomDetail'
import TeacherClassroomDetail from '@/features/classroom/page/detail/TeacherClassroomDetail'
import { UserRole } from '@/types/userRole'
import { Session } from 'next-auth'

export default function RoleBasedClassroomDetailPage({ session }: { session: Session }) {
  let role = session?.user.role
  role = UserRole.STUDENT

  switch (role) {
    case UserRole.TEACHER:
      return <StudentClassroomDetail />
    case UserRole.STUDENT:
      return <TeacherClassroomDetail />
    default:
      return <div>Access Denied</div>
  }
}
