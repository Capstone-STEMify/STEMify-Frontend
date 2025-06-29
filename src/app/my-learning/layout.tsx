import { metadata } from 'app/layout'
import { SidebarInset, SidebarProvider } from '@/components/shadcn/sidebar'
import { UserRole } from '@/types/userRole'
import { MyLearningHeader } from '@/features/my-learning/components/detail/sidebar/MyLearningHeader'
import { MyLearningSidebar } from '@/features/my-learning/components/detail/sidebar/MyLearningSidebar'

metadata.title = 'My Learning'
export default async function MyLearningLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const role = UserRole.STUDENT

  return (
    <div className='[--header-height:calc(--spacing(14))]'>
      <SidebarProvider className='flex flex-col'>
        <MyLearningHeader />
        <div className='flex flex-1'>
          <MyLearningSidebar role={role} />
          <SidebarInset>{children}</SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
