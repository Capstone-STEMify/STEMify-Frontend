'use client'

import { UserRole } from '@/types/userRole'
import { Session } from 'next-auth'
import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'

// Lazy import
const StudentClassroomDetail = dynamic(() => import('@/features/classroom/page/detail/StudentClassroomDetail'))
const TeacherClassroomDetail = dynamic(() => import('@/features/classroom/page/detail/TeacherClassroomDetail'))

export default function RoleBasedClassroomDetailPage({ session }: { session: Session }) {
  let role = session?.user.role
  role = UserRole.STUDENT // For testing purposes

  switch (role) {
    case UserRole.STUDENT:
      return <StudentClassroomDetail />
    case UserRole.TEACHER:
      return <TeacherClassroomDetail />
    default:
      redirect('/unauthorized')
  }
}
