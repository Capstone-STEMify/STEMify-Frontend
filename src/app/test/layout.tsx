import Header from '@/components/layout/header/Header'
import { ModalProvider } from '@/components/shared/modals/ModalProvider'
import { metadata } from 'app/layout'
import { cookies } from 'next/headers'

metadata.title = 'Test Layout'
export default async function TestLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true'
  return (
    <>
      <Header />
      <ModalProvider>
        <div className='bg-light'>{children}</div>
      </ModalProvider>
    </>
  )
}
