import { LessonCard } from '@/components/shared/card/LessonCard'
import ClassroomDetailAction from '@/features/classroom/components/classroom-detail/content/shared/ClassroomDetailAction'
import { dummyCardData } from '@/utils/mockData'

export default function StudentClassroomContent() {
  return (
    <div className='container mx-auto max-w-7xl space-y-8 p-4'>
      <ClassroomDetailAction />

      <div className='grid grid-cols-1 gap-x-14 gap-y-8 lg:grid-cols-2 xl:grid-cols-4'>
        {dummyCardData.map((course, index) => {
          return (
            <LessonCard
              title={course.title}
              description={course.description}
              imageSrc={course.image}
              key={index}
              featured={true}
              size='md'
              onEdit={() => console.log('Edit clicked')}
            />
          )
        })}
      </div>
    </div>
  )
}
