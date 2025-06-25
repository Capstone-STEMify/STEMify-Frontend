import { SidebarInset, SidebarProvider } from '@/components/shadcn/sidebar'
import { UserRole } from '@/types/userRole'
import { ClassroomSidebar } from '@/features/classroom/components/classroom-detail/sidebar/ClassroomSidebar'
import { ClassroomDetailHeader } from '@/features/classroom/components/classroom-detail/sidebar/ClassroomDetailHeader'

export default async function LessonStaffLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const role = UserRole.STAFF

  return (
    <div className='[--header-height:calc(--spacing(14))]'>
      <SidebarProvider className='flex flex-col'>
        <ClassroomDetailHeader />
        <div className='flex flex-1'>
          <ClassroomSidebar role={role} />
          <SidebarInset>{children}</SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
