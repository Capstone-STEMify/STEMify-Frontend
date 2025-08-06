import { metadata } from 'app/layout'
import { SidebarInset, SidebarProvider } from '@/components/shadcn/sidebar'
import { UserRole } from '@/types/userRole'
import { ClassroomDetailHeader } from '@/features/classroom/components/detail/sidebar/ClassroomDetailHeader'
import { ClassroomSidebar } from '@/features/classroom/components/detail/sidebar/ClassroomSidebar'

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
        <ClassroomDetailHeader />
        <div className='flex flex-1'>
          <ClassroomSidebar role={role} />
          <SidebarInset>{children}</SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
