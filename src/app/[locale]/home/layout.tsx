import Header from '@/components/layout/Header'
import { metadata } from 'app/[locale]/layout'

metadata.title = 'Home'
export default async function HomeLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='bg-white'>
      <Header />
      <main>{children}</main>
    </div>
  )
}
