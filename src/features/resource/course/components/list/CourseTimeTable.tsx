import { Course } from '@/features/resource/course/types/course.type'
import { cn } from '@/utils/shadcn/utils'

interface Week {
  weekNumber: number
  courses: Course[]
}

interface CourseTimeTableProps {
  weeks: Week[]
  className?: string
}

export function CourseTimeTable({ weeks, className }: CourseTimeTableProps) {
  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <table className='w-full border-collapse'>
        <tbody>
          {weeks.map((week) => (
            <tr key={`week-${week.weekNumber}`}>
              <td className='w-32 border border-gray-200 bg-sky-500 px-6 py-4 text-center align-top font-semibold text-white'>
                Week {week.weekNumber}
              </td>
              <td className='border border-gray-200 bg-gray-50 p-0'>
                <div className='flex gap-3 p-3'>
                  {week.courses.map((course) => (
                    <div
                      key={course.id}
                      className='min-w-[180px] flex-1 rounded-lg border border-gray-300 bg-white p-3 transition-shadow hover:shadow-md'
                    >
                      <h3 className='mb-2 line-clamp-2 text-sm font-medium text-gray-900'>{course.title}</h3>

                      <div className='flex items-center justify-between text-xs text-gray-500'>
                        <span className='font-mono'>{course.code}</span>
                        <span>{course.duration} phút</span>
                      </div>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
