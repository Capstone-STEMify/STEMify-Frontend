'use client'

import dynamic from 'next/dynamic'
import { UserRole } from '@/types/userRole'
import { Session } from 'next-auth'

// Lazy import
const ClassroomLanding = dynamic(() => import('@/features/classroom/components/ClassroomLanding'))
const StudentClassroomList = dynamic(() => import('@/features/classroom/page/list/StudentClassroomList'))
const TeacherClassroomList = dynamic(() => import('@/features/classroom/page/list/TeacherClassroomList'))

export default function RoleBasedClassroomListPage({ session }: { session: Session }) {
  let role = session?.user.role
  role = UserRole.TEACHER

  switch (role) {
    case UserRole.TEACHER:
      return <TeacherClassroomList />
    case UserRole.STUDENT:
      return <StudentClassroomList />
    case UserRole.GUEST:
    default:
      return <ClassroomLanding />
  }
}
