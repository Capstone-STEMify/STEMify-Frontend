import ClassroomSubHeaderServer from '@/features/classroom/components/ui/ClassroomSubHeaderServer'

export default function ClassroomDetailLayout({
  children,
  params: { classroomId, locale }
}: {
  children: React.ReactNode
  params: { classroomId: number; locale: string }
}) {
  return (
    <div className='space-y-2'>
      <ClassroomSubHeaderServer classroomId={classroomId} locale={locale} />
      <main>{children}</main>
    </div>
  )
}
