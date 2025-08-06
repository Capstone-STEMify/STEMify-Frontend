import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import { metadata } from 'app/layout'

metadata.title = 'Course'
export default async function PublicCourseLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <main className='mt-24'>{children}</main>
    </>
  )
}
