import { AppSidebar } from '@/features/classroom/components/classroom-detail/sidebar/app-sidebar'
import { SiteHeader } from '@/features/classroom/components/classroom-detail/header/site-header'
import { SidebarInset, SidebarProvider } from '@/components/shadcn/sidebar'
import { UserRole } from '@/types/userRole'
import StudentClassroomContent from '@/features/classroom/components/classroom-detail/content/StudentClassroomContent'

export const iframeHeight = '800px'
export const description = 'A sidebar with a header and a search form.'

export default function StudentClassroomDetail() {
  return (
    <div className='[--header-height:calc(--spacing(14))]'>
      <SidebarProvider className='flex flex-col'>
        <SiteHeader />
        <div className='flex flex-1'>
          <AppSidebar role={UserRole.STUDENT} />
          <SidebarInset>
            <StudentClassroomContent />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
