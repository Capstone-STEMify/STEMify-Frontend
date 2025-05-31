import { metadata } from 'app/layout'

metadata.title = 'Student'
export default function StudentLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div>{children}</div>
}
