import { SidebarInset, SidebarProvider } from '@/components/shadcn/sidebar'
import { SiteHeader } from '@/components/shadcn/site-header'
import { authOptions } from '@/libs/auth/authOptions'
import { UserRole } from '@/types/userRole'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { AdminAppSidebar } from '../../../components/layout/admin/sidebar/admin-app-sidebar'

export const metadata: Metadata = {
  title: 'Admin'
}

export default async function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)

  if (session?.user.userRole !== UserRole.ADMIN && session?.user.userRole !== UserRole.STAFF) {
    return <div className='p-4'>Access Denied</div>
  }
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 60)',
          '--header-height': 'calc(var(--spacing) * 12)'
        } as React.CSSProperties
      }
    >
      <AdminAppSidebar variant='inset' user={session.user} />
      <SidebarInset>
        <SiteHeader />
        <div className='flex flex-1 flex-col'>
          <div className='@container/main flex flex-1 flex-col gap-2'>
            <div className='h-full flex-1'>{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
