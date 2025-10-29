'use client'
import { ClassroomCard } from '@/features/classroom/components/ui/ClassroomCard'
import ClassroomCalendar from '@/features/classroom/components/ui/ClassroomCalendar'
import ClassroomTable from '@/features/classroom/components/list/table/ClassroomTable'

export default function OrganizationClassroomList() {
  const classes = [
    {
      id: 1,
      category: 'JAVA FUNDAMENTAL',
      duration: '24 Hours',
      title: 'Contextual understanding and how to use the adobe illustrator',
      buttonText: 'START THE CLASS',
      buttonColor: 'bg-teal-500',
      students: [
        { id: 1, name: 'Student 1', avatar: '/diverse-students-studying.png' },
        { id: 2, name: 'Student 2', avatar: '/diverse-students-studying.png' },
        { id: 3, name: 'Student 3', avatar: '/diverse-students-studying.png' }
      ],
      bgColor: 'bg-teal-600'
    },
    {
      id: 2,
      category: 'UX FUNDAMENTAL',
      duration: '20 Hours',
      title: 'Introduction to foundation of desk design and how to present',
      buttonText: 'UPCOMING CLASS',
      buttonColor: 'bg-orange-400',
      students: [
        { id: 1, name: 'Student 1', avatar: '/diverse-students-studying.png' },
        { id: 2, name: 'Student 2', avatar: '/diverse-students-studying.png' },
        { id: 3, name: 'Student 3', avatar: '/diverse-students-studying.png' }
      ],
      bgColor: 'bg-white',
      textColor: 'text-gray-800',
      borderColor: 'border border-gray-200'
    },
    {
      id: 3,
      category: 'UX FUNDAMENTAL',
      duration: '22 Hours',
      title: 'Basic illustration and how to use the adobe illustrator',
      buttonText: 'UPCOMING CLASS',
      buttonColor: 'bg-orange-400',
      students: [
        { id: 1, name: 'Student 1', avatar: '/diverse-students-studying.png' },
        { id: 2, name: 'Student 2', avatar: '/diverse-students-studying.png' },
        { id: 3, name: 'Student 3', avatar: '/diverse-students-studying.png' }
      ],
      bgColor: 'bg-white',
      textColor: 'text-gray-800',
      borderColor: 'border border-gray-200'
    }
  ]

  return (
    <main className='min-h-screen bg-gray-50 p-8'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-6 flex items-end justify-between'>
          <div>
            <h1 className='mb-2 text-3xl font-bold text-gray-900'>Upcoming class</h1>
            <p className='text-gray-600'>Today, you have 3 upcoming class</p>
          </div>
          <ClassroomCalendar />
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {classes.map((classItem) => (
            <ClassroomCard key={classItem.id} {...classItem} />
          ))}
        </div>
        <ClassroomTable />
      </div>
    </main>
  )
}
