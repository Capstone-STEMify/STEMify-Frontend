import Header from '@/components/layout/Header'
import { ModalProvider } from '@/providers/ModalProvider'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Code Lab'
}

export default async function CodeLab({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <Header />
      <div className='bg-light mx-auto mt-18 w-full'>{children}</div>
    </div>
  )
}
