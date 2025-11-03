import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import { metadata } from '../layout'

metadata.title = 'Assignment'
export default async function AssignmentLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <Header />
      <main className='mt-24'>{children}</main>
    </div>
  )
}
