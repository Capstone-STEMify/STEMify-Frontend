import ClassroomSubHeader from '@/features/classroom/components/ui/ClassroomSubheader'

export default async function ClassroomDetailLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className='space-y-2'>
      <ClassroomSubHeader />
      <main>{children}</main>
    </div>
  )
}
