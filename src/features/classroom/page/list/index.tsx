'use client'
import ClassRoomLanding from '@/features/classroom/components/ClassRoomLanding '
import StudentClassroomList from '@/features/classroom/page/list/StudentClassroomList'
import TeacherClassroomList from '@/features/classroom/page/list/TeacherClassroomList'
import { UserRole } from '@/types/userRole'
import { Session } from 'next-auth'

export default function RoleBasedClassroomListPage({ session }: { session: Session }) {
  let role = session?.user.role
  role = UserRole.STUDENT

  switch (role) {
    case UserRole.TEACHER:
      return <TeacherClassroomList />
    case UserRole.STUDENT:
      return <StudentClassroomList />
    case UserRole.GUEST:
    default:
      return <ClassRoomLanding />
  }
}
