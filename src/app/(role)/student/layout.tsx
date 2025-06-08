import Footer from '@/components/layout/Footer'
import { metadata } from 'app/layout'

metadata.title = 'Student'
export default function StudentLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <div className='flex flex-col justify-center'>{children}</div>
      <Footer />
    </>
  )
}
