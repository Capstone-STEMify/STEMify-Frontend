import Header from '@/components/layout/Header'
import { metadata } from 'app/[locale]/layout'

metadata.title = 'Course'
export default async function PublicCourseLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <main className='mt-20'>{children}</main>
    </>
  )
}
