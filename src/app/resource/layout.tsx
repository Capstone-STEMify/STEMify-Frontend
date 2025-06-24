import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resource'
}
export default async function ResourceLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <main>{children}</main>
}
