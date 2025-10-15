import Header from '@/components/layout/Header'
import { metadata } from 'app/[locale]/layout'

metadata.title = 'Plan'
export default async function PublicPlanLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='min-h-screen bg-white'>
      <Header />
      <main>{children}</main>
    </div>
  )
}
