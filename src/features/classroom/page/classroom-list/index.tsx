import StudentClassroomList from '@/features/classroom/page/classroom-list/StudentClassroomList'
import TeacherClassroomList from '@/features/classroom/page/classroom-list/TeacherClassroomList'
import { UserRole } from '@/types/userRole'
import { Session } from 'next-auth'

export default function RoleBasedClassroomListPage({ session }: { session: Session }) {
  let role = session?.user.role
  role = UserRole.TEACHER

  switch (role) {
    case UserRole.TEACHER:
      return <TeacherClassroomList />
    case UserRole.STUDENT:
      return <StudentClassroomList />
    default:
      return <div>Access Denied</div>
  }
}
