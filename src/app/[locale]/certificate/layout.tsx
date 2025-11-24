import { metadata } from '../layout'
import { UserRole } from '@/types/userRole'
import Header from '@/components/layout/Header'

metadata.title = 'Accomplishment'
export default async function AccomplishmentLayout({
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
