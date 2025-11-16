import { useGetClassroomScheduleQuery } from '@/features/classroom/api/classroomApi'
import { cn } from '@/utils/shadcn/utils'

interface ClassroomScheduleProps {
  classroomId: number
  className?: string
}

export function ClassroomSchedule({ classroomId, className }: ClassroomScheduleProps) {
  const { data, isLoading, error } = useGetClassroomScheduleQuery({ classroomId })

  if (isLoading) {
    return <div className='py-8 text-center text-gray-500'>Đang tải...</div>
  }

  if (error || !data?.data) {
    return <div className='py-8 text-center text-red-500'>Không thể tải thời khóa biểu</div>
  }

  const schedule = data.data

  return (
    <div className={cn('w-full space-y-6', className)}>
      {/* Header Info */}
      <div className='flex gap-8 rounded-lg bg-sky-50 px-4 py-3 text-sm'>
        <div>
          <span className='font-medium text-gray-700'>Thời lượng/tuần:</span>{' '}
          <span className='font-semibold text-sky-700'>{schedule.minutesPerWeek} phút</span>
        </div>
        <div>
          <span className='font-medium text-gray-700'>Tổng số tuần:</span>{' '}
          <span className='font-semibold text-sky-700'>{schedule.totalWeeks}</span>
        </div>
      </div>

      {/* Schedule by Course */}
      {schedule.courseSchedule.map((courseSchedule) => (
        <div key={`course-${courseSchedule.courseId}`} className='overflow-hidden rounded-lg border border-gray-200'>
          {/* Course Header */}
          <div className='bg-sky-500 px-4 py-3'>
            <h2 className='font-semibold text-white'>{courseSchedule.courseTitle}</h2>
          </div>

          {/* Weeks Table */}
          <table className='w-full'>
            <tbody>
              {courseSchedule.scheduleItems.map((scheduleItem) => (
                <tr key={`week-${scheduleItem.weekNumber}`} className='border-t border-gray-200'>
                  <td className='w-28 bg-sky-50 px-4 py-3 text-center align-top font-medium text-sky-700'>
                    Week {scheduleItem.weekNumber}
                  </td>
                  <td className='bg-white p-3'>
                    <div className='flex flex-wrap gap-2'>
                      {scheduleItem.lessonSchedule.map((lesson) => (
                        <div
                          key={lesson.lessonId}
                          className='min-w-[160px] flex-1 rounded border border-gray-300 bg-white p-3 hover:border-sky-300 hover:shadow-sm'
                        >
                          <p className='mb-1 line-clamp-2 text-sm font-medium text-gray-900'>{lesson.lessonTitle}</p>
                          <p className='text-xs text-gray-500'>{lesson.duration} phút</p>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}
