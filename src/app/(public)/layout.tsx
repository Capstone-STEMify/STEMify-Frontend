import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/header/Header'
import { metadata } from 'app/layout'

metadata.title = 'Stemify Education'
export default function HomeLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      {/* <Header /> */}
      <main>{children}</main>
      {/* <Footer /> */}
    </div>
  )
}
