import { metadata } from '../layout'
import Header from '@/components/layout/Header'

metadata.title = 'My Learning'
export default async function MyLearningLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <Header />
      <div className='mt-20'>{children}</div>
    </div>
  )
}
