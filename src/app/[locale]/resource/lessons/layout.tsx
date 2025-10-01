import Header from '@/components/layout/Header'

export default async function LessonLayout({
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
