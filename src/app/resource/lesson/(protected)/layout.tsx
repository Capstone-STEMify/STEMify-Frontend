import { SidebarInset, SidebarProvider } from '@/components/shadcn/sidebar'
import { ClassroomDetailHeader } from '@/features/classroom/components/detail/sidebar/ClassroomDetailHeader'
import { ClassroomSidebar } from '@/features/classroom/components/detail/sidebar/ClassroomSidebar'
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
        <ClassroomDetailHeader />
        <div className='flex flex-1'>
          <ClassroomSidebar role={role} />
          <SidebarInset>{children}</SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
