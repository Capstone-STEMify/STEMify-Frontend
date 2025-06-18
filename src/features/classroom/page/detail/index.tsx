'use client'

import StudentClassroomDetail from '@/features/classroom/page/detail/StudentClassroomDetail'
import TeacherClassroomDetail from '@/features/classroom/page/detail/TeacherClassroomDetail'
import { UserRole } from '@/types/userRole'
import { Session } from 'next-auth'
import { redirect } from 'next/navigation'

export default function RoleBasedClassroomDetailPage({ session }: { session: Session }) {
  let role = session.user.role
  role = UserRole.STUDENT

  switch (role) {
    case UserRole.STUDENT:
      return <StudentClassroomDetail />
    case UserRole.TEACHER:
      return <TeacherClassroomDetail />
    default:
      redirect('/unauthorized')
  }
}
