import { metadata } from 'app/layout'

metadata.title = 'Classroom'
export default async function ClassroomLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <main>{children}</main>
    </div>
  )
}
