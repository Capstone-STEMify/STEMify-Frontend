import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'

export default function CourseDetailLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='bg-light min-h-screen'>
      <Header />
      <main className='mt-20'>{children}</main>
    </div>
  )
}
