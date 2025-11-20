import { Button } from '@/components/shadcn/button'
import { useUpdateCourseMutation } from '@/features/resource/course/api/courseApi'
import { Course, CourseStatus } from '@/features/resource/course/types/course.type'
import { useAppSelector } from '@/hooks/redux-hooks'
import { UserRole } from '@/types/userRole'
import { Bookmark, Plus, Share2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

type CourseActionProps = {
  course: Course
}

export default function CourseAction({ course }: CourseActionProps) {
  const t = useTranslations('course')
  const tc = useTranslations('common')

  return (
    <section className='mt-3 flex flex-col items-center'>
      <div className='h-[0.1px] w-52 bg-gray-300'></div>

      {/* Secondary actions */}
      <div className='text-muted-foreground mt-4 grid w-full max-w-md grid-cols-3 gap-6 text-center text-xs'>
        <div className='flex flex-col items-center gap-1'>
          <Plus className='h-5 w-5' />
          <span>{tc('button.add')}</span>
        </div>
        <div className='flex flex-col items-center gap-1'>
          <Bookmark className='h-5 w-5' />
          <span>{tc('button.wishlist')}</span>
        </div>
        <div className='flex flex-col items-center gap-1'>
          <Share2 className='h-5 w-5' />
          <span>{tc('button.share')}</span>
        </div>
      </div>
    </section>
  )
}
