import Header from '@/components/layout/Header'
import ClassroomSubHeader from '@/features/classroom/components/ui/ClassroomSubheader'

export default async function ClassroomLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Header />
      <div className='pt-24'>
        <ClassroomSubHeader />
        <main>{children}</main>
      </div>
    </div>
  )
}
