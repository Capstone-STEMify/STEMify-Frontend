import { metadata } from 'app/layout'
import { UserRole } from '@/types/userRole'
import Header from '@/components/layout/Header'

metadata.title = 'My Learning'
export default async function MyLearningLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const role = UserRole.STUDENT

  return (
    <div>
      <Header />
      <div className='mt-20'>{children}</div>
    </div>
  )
}
