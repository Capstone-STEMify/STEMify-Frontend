import { metadata } from 'app/layout'

metadata.title = 'Student'
export default function StudentLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className='flex justify-center flex-col'>{children}</div>
}
