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
      <div className='bg-light mx-auto mt-20 w-full py-8'>{children}</div>
    </div>
  )
}
