import { authOptions } from '@/libs/auth/authOptions'
import { metadata } from 'app/layout'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

metadata.title = 'Classroom'
export default async function ProtecedClassroomLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)
  // if (!session) redirect('/login')
  return (
    <div>
      <main>{children}</main>
    </div>
  )
}
