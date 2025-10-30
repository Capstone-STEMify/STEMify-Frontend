import Header from '@/components/layout/Header'
import ClassroomSubHeader from '@/features/classroom/components/ui/ClassroomSubheader'

export default async function ClassroomLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <Header />
      <div className='mt-20'>
        <ClassroomSubHeader />
        {children}
      </div>
    </div>
  )
}
