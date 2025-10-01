import Header from '@/components/layout/Header'
import { metadata } from '../layout'

metadata.title = 'My Project'
export default async function MyProjectLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <Header />
      <main className='mt-20'>{children}</main>
    </div>
  )
}
