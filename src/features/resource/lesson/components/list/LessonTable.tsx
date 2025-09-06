'use client'
import React, { useEffect, useState } from 'react'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useGetLessonAction } from './LessonTableAction'
import { useSearchLessonQuery } from '../../api/lessonApi'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setPageIndex, setPageSize } from '@/features/resource/lesson/slice/lessonSlice'
import { Lesson, LessonQueryParams } from '@/features/resource/lesson/types/lesson.type'
import LessonListAction from './LessonListAction'
import { Button } from '@/components/shadcn/button'
import { IconPlus } from '@tabler/icons-react'
import { useLocale, useTranslations } from 'next-intl'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import Link from 'next/link'
import CardLayout from '@/components/shared/card/CardLayout'
import { Badge } from '@/components/shadcn/badge'
import { SPagination } from '@/components/shared/SPagination'
import { capitalizeFirst, formatDuration } from '@/utils/index'
import { Clock, LayoutGrid, TableIcon } from 'lucide-react'
import { getCourseStatusBadgeClass, getStatusBadgeClass } from '@/utils/badgeColor'
import { useUpdateLessonOrderMutation } from '@/features/resource/course/api/courseApi'
import { toast } from 'sonner'

type ViewMode = 'table' | 'card'

export default function LessonTable({
  courseIdSelected,
  refetch
}: {
  courseIdSelected?: number
  refetch?: () => void
}) {
  const locale = useLocale()
  const router = useRouter()
  const { courseId } = useParams()
  const columns = useGetLessonAction()

  const t = useTranslations('Admin.course_details')
  const tt = useTranslations('toast')

  const dispatch = useAppDispatch()
  const lessonParams = useAppSelector((state) => state.lesson)

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window === 'undefined') return 'table'
    return (localStorage.getItem('course_view_mode') as ViewMode) || 'table'
  })

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('course_view_mode', viewMode)
  }, [viewMode])

  const queryParams: LessonQueryParams = {
    courseId: courseIdSelected || lessonParams.courseId,
    createdByUserId: lessonParams.createdByUserId,
    ageRangeId: lessonParams.ageRangeId,
    topicId: lessonParams.topicId,
    skillId: lessonParams.skillId,
    standardId: lessonParams.standardId,
    pageNumber: lessonParams.pageNumber,
    pageSize: lessonParams.pageSize,
    search: lessonParams.search,
    status: lessonParams.status,
    orderBy: courseIdSelected ? 'orderindex' : 'createdDate',
    sortDirection: courseIdSelected ? 'Asc' : 'Desc'
  }

  useEffect(() => {
    if (courseId) {
      dispatch(setPageSize(50))
    } else dispatch(setPageSize(10))
  }, [dispatch])

  const { data } = useSearchLessonQuery(queryParams)
  const [updateCourseLessonOrder] = useUpdateLessonOrderMutation()

  const rows = React.useMemo(() => data?.data.items ?? [], [data])

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }

  const handleSaveOrder = async (orderedLessonIds: number[]) => {
    try {
      await updateCourseLessonOrder({
        id: Number(courseId),
        orderedLessonIds
      }).unwrap()
      toast.success(tt('successMessage.saveOrder'))
    } catch (e) {
      toast.error(tt('errorMessage'))
    }
  }

  const handleCreate = () => {
    router.push(`/${locale}/admin/lesson/create?courseId=${courseIdSelected}`)
  }

  if (!data) return null

  return (
    <div>
      <LessonListAction />
      <div className='flex items-center justify-between gap-3'>
        {courseIdSelected && (
          <Button
            variant='outline'
            size='sm'
            className='bg-amber-custom-400 my-5 cursor-pointer text-white'
            onClick={handleCreate}
          >
            <IconPlus />
            <span className='hidden lg:inline'>{t('button.add')}</span>
          </Button>
        )}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
          <TabsList>
            <TabsTrigger value='table' className='flex items-center gap-1'>
              <TableIcon className='h-4 w-4' />
            </TabsTrigger>
            <TabsTrigger value='card' className='flex items-center gap-1'>
              <LayoutGrid className='h-4 w-4' />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
        <TabsContent value='table'>
          <DataTable
            data={rows}
            columns={columns}
            enableRowSelection
            pagingData={data}
            pagingParams={queryParams}
            handlePageChange={handlePageChange}
            enableDnd
            onReorder={(newData) => {
              const orderedLessonIds = newData.map((item) => item.id)
              handleSaveOrder(orderedLessonIds)
              if (refetch) refetch()
            }}
          />
        </TabsContent>

        {/* CARD VIEW */}
        <TabsContent value='card'>
          <div className='px-2'>
            <div className='grid grid-cols-1 justify-items-center-safe gap-y-10 py-6 sm:grid-cols-2 xl:grid-cols-4'>
              {rows.map((lesson: Lesson) => (
                <Link key={lesson.id} href={`/${locale}/admin/lesson/${lesson.id}/pacing-guide`} className='w-full'>
                  <CardLayout
                    imageSrc={lesson.imageUrl}
                    size='sm'
                    badge={
                      <Badge className={`${getStatusBadgeClass(lesson.status)}`}>
                        {capitalizeFirst(lesson.status)}
                      </Badge>
                    }
                  >
                    <div>
                      <h3 className='line-clamp-1 text-sm font-semibold text-gray-900'>{lesson.title}</h3>
                      <p className='line-clamp-2 text-xs text-gray-600'>{lesson.description}</p>
                    </div>

                    <div className='mt-auto flex flex-wrap items-center gap-2'>
                      {lesson.ageRangeLabel && (
                        <Badge className='bg-sky-custom-300'>
                          <span className='mr-0.5'> {t('card.age')}</span>
                          {lesson.ageRangeLabel}
                        </Badge>
                      )}
                      {lesson.duration > 0 && (
                        <Badge className={`bg-red-300`}>
                          <Clock className='mr-0.5' />
                          {formatDuration(lesson.duration)}
                        </Badge>
                      )}
                    </div>
                  </CardLayout>
                </Link>
              ))}
            </div>

            {data?.data?.totalPages > 1 && (
              <SPagination
                pageNumber={queryParams.pageNumber!}
                totalPages={data.data.totalPages}
                onPageChanged={handlePageChange}
                className='pb-6'
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
