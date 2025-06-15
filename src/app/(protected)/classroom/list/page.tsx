import RoleBasedClassroomListPage from '@/features/classroom/page/list'
import { authOptions } from '@/libs/auth/authOptions'
import { getServerSession } from 'next-auth'

export default async function ClassroomListPage() {
  const session = await getServerSession(authOptions)

  return <RoleBasedClassroomListPage session={session!} />
}
