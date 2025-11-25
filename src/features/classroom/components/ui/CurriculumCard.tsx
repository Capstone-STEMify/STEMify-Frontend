import { Button } from '@/components/shadcn/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/shadcn/avatar'

interface Student {
  id: number
  name: string
  avatar: string
}

interface CurriculumCardProps {
  id: number
  curriculumTitle: string
  duration: string
  students: Student[]
  curriculumCode: string
}

export function CurriculumCard({ curriculumTitle, duration, curriculumCode, students }: CurriculumCardProps) {
  return (
    <div className={`flex h-full flex-col justify-between rounded-lg bg-white p-6`}>
      {/* Header */}
      <div className='mb-6'>
        <div className='mb-4 flex items-start justify-between'>
          <span className={'text-xs font-semibold tracking-wider text-teal-100'}>{curriculumCode}</span>
          <span className={'text-xs font-semibold tracking-wider text-teal-100'}>{duration}</span>
        </div>

        {/* Title */}
        <h3 className={`text-lg leading-tight font-bold text-gray-900`}>{curriculumTitle}</h3>
      </div>

      {/* Footer */}
      <div className='flex items-end justify-between'>
        {/* Button */}
        <Button
          className={`rounded bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90`}
        >
          Enroll
        </Button>

        {/* Student Avatars */}
        <div className='flex -space-x-2'>
          {students.map((student) => (
            <Avatar key={student.id} className='h-8 w-8 border-2 border-white'>
              <AvatarImage src={student.avatar || '/placeholder.svg'} alt={student.name} />
              <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
          {students.length > 0 && (
            <div className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-300 text-xs font-semibold text-gray-700'>
              +{students.length}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
