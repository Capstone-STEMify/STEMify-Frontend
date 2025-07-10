import Header from '@/components/layout/header/Header'
import { ModalProvider } from '@/providers/ModalProvider'
import { metadata } from 'app/layout'

metadata.title = 'Test Layout'
export default async function TestLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <ModalProvider>
        <div className='bg-light'>{children}</div>
      </ModalProvider>
    </>
  )
}
