import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/header/Header'

export default function CourseDetailLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
