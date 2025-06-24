import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/header/Header'
import { metadata } from 'app/layout'

metadata.title = 'Classroom'
export default async function PublicResourceLayout({
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
