import { AppSidebar } from '@/features/classroom/components/classroom-detail/sidebar/app-sidebar'
import { SiteHeader } from '@/features/classroom/components/classroom-detail/header/site-header'
import { SidebarInset, SidebarProvider } from '@/components/shadcn/sidebar'
import { UserRole } from '@/types/userRole'
import TeacherClassroomContent from '@/features/classroom/components/classroom-detail/content/TeacherClassroomContent'

export const iframeHeight = '800px'
export const description = 'A sidebar with a header and a search form.'
export default function TeacherClassroomDetail() {
  return (
    <div className='[--header-height:calc(--spacing(14))]'>
      <SidebarProvider className='flex flex-col'>
        <SiteHeader />
        <div className='flex flex-1'>
          <AppSidebar role={UserRole.TEACHER} />
          <SidebarInset>
            <TeacherClassroomContent />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
