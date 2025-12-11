'use client'

import { SessionProvider } from 'next-auth/react'
import AuthSessionSync from '@/providers/AuthSessionSync'
import { Toaster } from 'sonner'
import StoreProvider from '@/providers/StoreProvider'
import { ModalProvider } from '@/providers/ModalProvider'
import { Session } from 'next-auth'
import ChatAgent from '@/features/chat/ChatAgent'

export default function Providers({
  children,
  session
}: Readonly<{
  children: React.ReactNode
  session: Session | null
}>) {
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        <AuthSessionSync />
        <ModalProvider>
          {children}
          {/* <ChatAgent /> */}
        </ModalProvider>
        <Toaster />
      </StoreProvider>
    </SessionProvider>
  )
}
