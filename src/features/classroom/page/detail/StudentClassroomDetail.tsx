import { AppSidebar } from '@/features/classroom/components/classroom-detail/sidebar/app-sidebar'
import { SiteHeader } from '@/features/classroom/components/classroom-detail/header/site-header'
import { SidebarInset, SidebarProvider } from '@/components/shadcn/sidebar'
import { UserRole } from '@/types/userRole'
import ResourceCard from '@/components/shared/card/ResourceCard'
import { dummyCardData } from '@/utils/mockData'

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
            <div className='grid max-w-6xl grid-cols-1 gap-4 p-4 md:grid-cols-3'>
              {dummyCardData.map((course, index) => {
                return (
                  <ResourceCard
                    size='sm'
                    key={index}
                    resource={{
                      title: course.title,
                      description: course.description,
                      image: course.image,
                      category: 'Math',
                      age: '8-9',
                      duration: '2 hours'
                    }}
                  />
                )
              })}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
