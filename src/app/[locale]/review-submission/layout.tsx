import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import { metadata } from '../layout'

metadata.title = 'Review Submission'
export default async function ReviewSubmissionLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  )
}