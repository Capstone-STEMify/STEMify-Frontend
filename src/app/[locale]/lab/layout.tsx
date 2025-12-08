import Header from '@/components/layout/Header'
import BackButton from '@/components/shared/button/BackButton'
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
      <div className='bg-light mt-20 min-h-[90vh]'>{children}</div>
    </div>
  )
}
