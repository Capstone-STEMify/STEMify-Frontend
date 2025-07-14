import { SidebarInset, SidebarProvider } from '@/components/shadcn/sidebar'
import { ResourceManageHeader } from '@/features/resource/layout/ResourceManageHeader'
import { ResourceManageSidebar } from '@/features/resource/layout/ResourceManageSidebar'
import { UserRole } from '@/types/userRole'

export default async function LessonStaffLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const role = UserRole.STAFF

  return (
    <div className='[--header-height:calc(--spacing(14))]'>
      <SidebarProvider className='flex flex-col'>
        <ResourceManageHeader />
        <div className='flex flex-1'>
          <ResourceManageSidebar role={role} />
          <SidebarInset>{children}</SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
