import Header from '@/components/layout/Header'
import { metadata } from 'app/[locale]/layout'

metadata.title = 'Plan'
export default async function PublicKitProductLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='min-h-screen bg-white'>
      <Header />
      <main className='mt-20'>{children}</main>
    </div>
  )
}
