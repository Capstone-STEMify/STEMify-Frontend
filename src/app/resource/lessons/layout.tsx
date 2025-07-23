import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'

export default async function LessonLayout({
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
