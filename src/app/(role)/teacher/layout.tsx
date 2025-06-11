import { metadata } from 'app/layout'

metadata.title = 'Teacher'
export default function TeacherLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div>{children}</div>
}
