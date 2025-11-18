import { metadata } from '../layout'
import Header from '@/components/layout/Header'

metadata.title = 'Assignment'
export default async function StudentAssignmentLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <Header />
      <div className='mt-20'>{children}</div>
    </div>
  )
}
