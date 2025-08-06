import Header from '@/components/layout/Header'
import { ModalProvider } from '@/providers/ModalProvider'
import { metadata } from '../layout'

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
        <div className='bg-light mt-30'>{children}</div>
      </ModalProvider>
    </>
  )
}
