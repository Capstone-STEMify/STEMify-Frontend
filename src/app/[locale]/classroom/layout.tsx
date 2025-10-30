import Header from '@/components/layout/Header'

export default async function ClassroomListLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Header />
      <div className='pt-20'>
        <main>{children}</main>
      </div>
    </div>
  )
}
