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
      <header className='bg-light/10 sticky top-0 z-50 shadow-md backdrop-blur-md'>
        <div className='px-5 py-2 sm:px-2 lg:px-5'>
          <Header />
        </div>
      </header>
      <main className='container'>{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}
