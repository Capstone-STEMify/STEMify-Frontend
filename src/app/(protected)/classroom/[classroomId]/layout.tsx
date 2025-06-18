import { metadata } from 'app/layout'
import { AppSidebar } from '@/features/classroom/components/classroom-detail/sidebar/app-sidebar'
import { SiteHeader } from '@/features/classroom/components/classroom-detail/header/site-header'
import { SidebarInset, SidebarProvider } from '@/components/shadcn/sidebar'
import { UserRole } from '@/types/userRole'

metadata.title = 'Classroom'
export default async function ClassroomDetailLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const role = UserRole.STUDENT

  return (
    <div className='[--header-height:calc(--spacing(14))]'>
      <SidebarProvider className='flex flex-col'>
        <SiteHeader />
        <div className='flex flex-1'>
          <AppSidebar role={role} />
          <SidebarInset>{children}</SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
