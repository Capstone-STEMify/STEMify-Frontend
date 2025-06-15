import RoleBasedClassroomListPage from '@/features/classroom/page/classroom-list'
import { authOptions } from '@/libs/auth/authOptions'
import { getServerSession } from 'next-auth'

export default async function ClassroomPage() {
  const session = await getServerSession(authOptions)

  return <RoleBasedClassroomListPage session={session!} />
}
