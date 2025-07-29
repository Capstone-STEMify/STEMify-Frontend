import Header from '@/components/layout/Header'
import { SidebarInset, SidebarProvider } from '@/components/shadcn/sidebar'
import BackButton from '@/components/shared/button/BackButton'
import SBreadcrumb from '@/components/shared/SBreadcrumb'
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
        <Header />
        <div className='mx-auto mt-24 max-w-7xl space-y-8'>
          <div className='flex items-center gap-4'>
            <BackButton />
            <SBreadcrumb />
          </div>
          {/* <ResourceManageHeader /> */}
          <div className='flex flex-1'>
            {/* <ResourceManageSidebar role={role} /> */}
            <SidebarInset>{children}</SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}
