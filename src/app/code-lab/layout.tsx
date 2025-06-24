import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/header/Header'
import { metadata } from 'app/layout'

metadata.title = 'Code Lab'
export default async function CodeLabLayout({
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
