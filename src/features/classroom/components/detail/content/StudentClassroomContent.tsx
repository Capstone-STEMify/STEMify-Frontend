import ClassroomDetailAction from '@/features/classroom/components/detail/content/shared/ClassroomDetailAction'
import { dummyCardData } from '@/utils/mockData'

export default function StudentClassroomContent() {
  return (
    <div className='container mx-auto max-w-7xl space-y-8 p-4'>
      <ClassroomDetailAction />

      <div className='grid grid-cols-1 gap-x-14 gap-y-8 lg:grid-cols-2 xl:grid-cols-4'></div>
    </div>
  )
}
