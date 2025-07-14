import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import { metadata } from 'app/layout'

metadata.title = 'Resource'
export default async function ResourceLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <Header />
      <main className='mt-24'>{children}</main>
      <Footer />
    </div>
  )
}
