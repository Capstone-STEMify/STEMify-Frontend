import ResourceCard from '@/components/shared/card/ResourceCard'
import ClassroomAction from '@/features/classroom/components/classroom-detail/content/shared/ClassroomAction'
import { dummyCardData } from '@/utils/mockData'

export default function TeacherClassroomContent() {
  return (
    <div className='container mx-auto max-w-7xl space-y-8 p-4'>
      <ClassroomAction />

      <div className='grid grid-cols-1 justify-items-center gap-y-5 lg:grid-cols-2 xl:grid-cols-3'>
        {dummyCardData.map((course, index) => {
          return (
            <ResourceCard
              size='sm'
              key={index}
              resource={{
                title: course.title,
                description: course.description,
                image: course.image,
                category: 'Math',
                age: '8-9',
                duration: '2 hours'
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
