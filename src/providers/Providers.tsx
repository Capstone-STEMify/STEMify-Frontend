'use client'

import { SessionProvider } from 'next-auth/react'
import AuthSessionSync from '@/providers/AuthSessionSync'
import { Toaster } from 'sonner'
import StoreProvider from '@/providers/StoreProvider'
import { ModalProvider } from '@/providers/ModalProvider'
import { usePathname } from 'next/navigation'
import ChatAgent from '@/features/chat/ChatAgent'

export default function Providers({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SessionProvider>
      <StoreProvider>
        <AuthSessionSync />
        <ModalProvider>
          {children} <ChatAgent />
        </ModalProvider>
        <Toaster />
      </StoreProvider>
    </SessionProvider>
  )
}
