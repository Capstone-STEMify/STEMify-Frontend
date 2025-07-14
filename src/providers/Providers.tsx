'use client'

import { SessionProvider } from 'next-auth/react'
import AuthSessionSync from '@/providers/AuthSessionSync'
import { Toaster } from 'sonner'
import StoreProvider from '@/providers/StoreProvider'
import { ModalProvider } from '@/providers/ModalProvider'

export default function Providers({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SessionProvider>
      <StoreProvider>
        <AuthSessionSync />
        <ModalProvider>{children}</ModalProvider>
        <Toaster />
      </StoreProvider>
    </SessionProvider>
  )
}
