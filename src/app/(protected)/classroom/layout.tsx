import { metadata } from 'app/layout'

metadata.title = 'Classroom'
export default async function ProtecedClassroomLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  // const session = await getServerSession(authOptions)
  // if (!session) redirect('/login')
  return (
    <div>
      <main>{children}</main>
    </div>
  )
}
