import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import RoleBasedClassroomListPage from '@/features/classroom/page/list'
import { authOptions } from '@/libs/auth/authOptions'
import { getServerSession } from 'next-auth'

export default async function ClassroomPage() {
  const session = await getServerSession(authOptions)

  return (
    <>
      <Header />
      <RoleBasedClassroomListPage session={session!} />
      <Footer />
    </>
  )
}
