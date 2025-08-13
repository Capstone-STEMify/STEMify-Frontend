import { AppSidebar } from '@/components/shadcn/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/shadcn/sidebar'
import { SiteHeader } from '@/components/shadcn/site-header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin'
}

export default async function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)'
        } as React.CSSProperties
      }
    >
      <AppSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader />
        <div className='flex flex-1 flex-col'>
          <div className='@container/main flex flex-1 flex-col gap-2'>
            <div>{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
