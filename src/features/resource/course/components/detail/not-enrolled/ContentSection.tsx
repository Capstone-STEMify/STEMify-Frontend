import { motion } from 'framer-motion'
import { fadeInUp } from '@/utils/motion'
import CardLayout from '@/components/shared/card/CardLayout'
import { Badge } from '@/components/shadcn/badge'
import { formatDuration } from '@/utils/index'
import { useSearchLessonQuery, useUpdateLessonMutation } from '@/features/resource/lesson/api/lessonApi'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setPageIndex, setPageSize } from '@/features/resource/lesson/slice/lessonSlice'
import { useEffect, useState } from 'react'
import { UserRole } from '@/types/userRole'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'
import { Lesson } from '@/features/resource/lesson/types/lesson.type'
import SEmpty from '@/components/shared/empty/SEmpty'
import { SPagination } from '@/components/shared/SPagination'

export default function ContentSection() {
  const t = useTranslations('course')

  const dispatch = useAppDispatch()

  const lessonsQuery = useAppSelector((state) => state.lesson)

  const { courseId } = useParams()

  const { data: lessons } = useSearchLessonQuery({
    ...lessonsQuery,
    courseId: Number(courseId),
    orderBy: 'orderindex',
    sortDirection: 'Asc',
    pageSize: 10
  })

  const [items, setItems] = useState<Lesson[]>([])

  useEffect(() => {
    if (lessons?.data?.items) setItems(lessons.data.items)
  }, [lessons?.data?.items])

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }

  if (!lessons?.data || lessons.data.items.length === 0) {
    return (
      <div className='bg-white py-5'>
        <h2 className='text-lg font-bold tracking-tight text-gray-900 sm:text-2xl'>{t('details.lesson.title')}</h2>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <SEmpty title={t('details.lesson.noData')} description={t('details.lesson.noDataDescription')} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.section
      id='lessons'
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true }}
      variants={fadeInUp}
      className='bg-white py-5'
    >
      <div>
        <div className='mb-5'>
          <h2 className='mb-2 text-lg font-bold tracking-tight text-gray-900 sm:text-2xl'>
            {t('details.lesson.title')}
          </h2>
          <p className='max-w-xl text-lg text-gray-600'>{t('details.lesson.description')}</p>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5'>
          {items.map((lesson) => (
            <CardLayout key={lesson.id} imageSrc={lesson.imageUrl || '/images/fallback.png'}>
              <div className='flex min-h-0 flex-1 flex-col'>
                <h3 className='line-clamp-1 text-base font-semibold'>{lesson.title}</h3>
                <p className='mb-2 line-clamp-4 text-xs text-gray-600'>{lesson.description}</p>
                <div className='mt-auto flex items-center gap-2'>
                  <Badge className='bg-blue-100 text-blue-800'>{lesson.ageRangeLabel}</Badge>
                  <Badge className='bg-green-100 text-green-800'>{formatDuration(lesson.duration)}</Badge>
                </div>
              </div>
            </CardLayout>
          ))}
        </div>

        {lessons.data.totalPages > 1 && (
          <SPagination
            pageNumber={lessons.data.pageNumber}
            totalPages={lessons.data.totalPages}
            onPageChanged={handlePageChange}
            className='mt-10'
          />
        )}
      </div>
    </motion.section>
  )
}
