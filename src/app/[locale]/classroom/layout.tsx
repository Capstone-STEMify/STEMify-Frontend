import Header from '@/components/layout/Header'

export default async function ClassroomListLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Header />
      <div className='pt-20'>
        <main className='container mx-auto'>{children}</main>
      </div>
    </div>
  )
}
