import { Button } from '@/components/shadcn/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/shadcn/avatar'

interface Student {
  id: number
  name: string
  avatar: string
}

interface ClassroomCardProps {
  id: number
  category: string
  duration: string
  title: string
  buttonText: string
  buttonColor: string
  students: Student[]
  bgColor?: string
  textColor?: string
  borderColor?: string
}

export function ClassroomCard({
  category,
  duration,
  title,
  buttonText,
  buttonColor,
  students,
  bgColor = 'bg-white',
  textColor = 'text-white',
  borderColor = ''
}: ClassroomCardProps) {
  return (
    <div className={`flex h-full flex-col justify-between rounded-lg p-6 ${bgColor} ${borderColor}`}>
      {/* Header */}
      <div className='mb-6'>
        <div className='mb-4 flex items-start justify-between'>
          <span
            className={`text-xs font-semibold tracking-wider ${textColor === 'text-white' ? 'text-teal-100' : 'text-teal-600'}`}
          >
            {category}
          </span>
          <span className={`text-xs font-semibold ${textColor === 'text-white' ? 'text-teal-100' : 'text-gray-500'}`}>
            {duration}
          </span>
        </div>

        {/* Title */}
        <h3 className={`text-lg leading-tight font-bold ${textColor}`}>{title}</h3>
      </div>

      {/* Footer */}
      <div className='flex items-end justify-between'>
        {/* Button */}
        <Button
          className={`${buttonColor} rounded px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90`}
        >
          {buttonText}
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
