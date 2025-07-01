import { motion } from 'framer-motion'
import { fadeInUp } from '@/utils/motion'
import CardLayout from '@/components/shared/card/CardLayout'
import { Badge } from '@/components/shadcn/badge'
import { formatDuration } from '@/utils/index'
import { BookOpen, Clock, Target } from 'lucide-react'
import { SPagination } from '@/components/shared/SPagination'
import { useSearchLessonQuery } from '@/features/resource/lesson/api/lessonApi'
import { useParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setPageIndex, setPageSize } from '@/features/resource/lesson/slice/lessonSlice'
import { useEffect } from 'react'

export default function ContentSection() {
  const dispatch = useAppDispatch()
  const lessonsQuery = useAppSelector((state) => state.lesson)
  useEffect(() => {
    dispatch(setPageSize(8))
  }, [dispatch])

  const params = useParams()
  const courseId = params.courseId

  const { data: lessons } = useSearchLessonQuery({ ...lessonsQuery, courseId: Number(courseId) })

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }

  if (!lessons?.data || lessons.data.items.length === 0) {
    return (
      <div className='bg-white py-12'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h2 className='mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>No Lessons Found</h2>
            <p className='text-lg text-gray-600'>There are currently no lessons available for this course.</p>
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
      className='scroll-mt-24 bg-white py-12'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>Lesson Content</h2>
          <p className='mx-auto mb-8 max-w-2xl text-lg text-gray-600'>
            Engaging activities designed to inspire learning and growth
          </p>

          {/* Stats */}
          <div className='flex flex-wrap justify-center gap-6 text-sm'>
            <div className='flex items-center gap-2 text-gray-700'>
              <BookOpen className='h-4 w-4 text-blue-600' />
              <span className='font-medium'>6 activities</span>
            </div>
            <div className='flex items-center gap-2 text-gray-700'>
              <Target className='h-4 w-4 text-green-600' />
              <span className='font-medium'>Interactive lessons</span>
            </div>
            <div className='flex items-center gap-2 text-gray-700'>
              <Clock className='h-4 w-4 text-purple-600' />
              <span className='font-medium'>3 hours total</span>
            </div>
          </div>
        </div>

        {/* Lesson Cards Section */}
        {/* use pagination */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {lessons?.data.items.map((lesson, index) => (
            <CardLayout
              key={index}
              imageSrc={lesson.imageUrl || '/images/fallback.png'}
              infor={<Badge className='bg-skye-custom-600 p-1'>{lesson.categoryNames}</Badge>}
            >
              <div className='flex min-h-0 flex-1 flex-col'>
                <h3 className='text-lg font-semibold'>{lesson.title}</h3>
                <p className='text-sm text-gray-600'>{lesson.description}</p>
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
