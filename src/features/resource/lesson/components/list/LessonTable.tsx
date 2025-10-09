'use client'
import React, { useEffect } from 'react'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useSearchLessonQuery } from '../../api/lessonApi'
import { useParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { resetParams, setPageIndex, setPageSize } from '@/features/resource/lesson/slice/lessonSlice'
import { Lesson, LessonQueryParams } from '@/features/resource/lesson/types/lesson.type'
import LessonListAction from './LessonListAction'
import { Button } from '@/components/shadcn/button'
import { IconPlus } from '@tabler/icons-react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import CardLayout from '@/components/shared/card/CardLayout'
import { Badge } from '@/components/shadcn/badge'
import { SPagination } from '@/components/shared/SPagination'
import { capitalizeFirst, formatDuration } from '@/utils/index'
import { Clock, LayoutGrid, TableIcon } from 'lucide-react'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { useUpdateLessonOrderMutation } from '@/features/resource/course/api/courseApi'
import { toast } from 'sonner'
import { useModal } from '@/providers/ModalProvider'
import STabs from '@/components/shared/STabs'
import { useGetLessonColumn } from '@/features/resource/lesson/components/list/LessonColumn'

export default function LessonTable({ courseIdSelected }: { courseIdSelected?: number }) {
  const locale = useLocale()
  const { courseId } = useParams()
  const columns = useGetLessonColumn()
  const { openModal } = useModal()

  const t = useTranslations('Admin.course_details')
  const tt = useTranslations('toast')

  const dispatch = useAppDispatch()
  const lessonParams = useAppSelector((state) => state.lesson)

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
  console.log('Lesson query params:', queryParams)

  useEffect(() => {
    dispatch(resetParams())
    if (courseId) {
      dispatch(setPageSize(50))
    } else dispatch(setPageSize(8))
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

  if (!data) return null

  return (
    <div>
      <LessonListAction />

      <STabs
        className='mt-4'
        defaultValue={'table'}
        additionalContent={{
          leftSide: (
            <div>
              {courseIdSelected && (
                <Button
                  variant='outline'
                  size='sm'
                  className='bg-amber-custom-400 cursor-pointer text-white'
                  onClick={() => openModal('upsertLesson', { courseId: courseIdSelected })}
                >
                  <IconPlus />
                  <span className='hidden lg:inline'>{t('button.add')}</span>
                </Button>
              )}
            </div>
          )
        }}
        items={[
          {
            value: 'table',
            label: <TableIcon className='h-4 w-4' />,
            content: (
              <>
                {courseId ? (
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
                    }}
                  />
                ) : (
                  <DataTable
                    data={rows}
                    columns={columns}
                    enableRowSelection
                    pagingData={data}
                    pagingParams={queryParams}
                    handlePageChange={handlePageChange}
                  />
                )}
              </>
            )
          },
          {
            value: 'card',
            label: <LayoutGrid className='h-4 w-4' />,
            content: (
              <div className='px-2'>
                <div className='grid grid-cols-1 justify-items-center-safe gap-10 py-6 sm:grid-cols-2 xl:grid-cols-4'>
                  {rows.map((lesson: Lesson) => (
                    <Link key={lesson.id} href={`/${locale}/admin/lesson/${lesson.id}/pacing-guide`} className='w-full'>
                      <CardLayout
                        imageSrc={lesson.imageUrl}
                        badge={
                          <Badge className={`${getStatusBadgeClass(lesson.status)}`}>
                            {capitalizeFirst(lesson.status)}
                          </Badge>
                        }
                        footer={
                          <div className='flex items-center gap-2'>
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
                        }
                      >
                        <div>
                          <h3 className='line-clamp-1 text-sm font-semibold text-gray-900'>{lesson.title}</h3>
                          <p className='line-clamp-3 text-xs text-gray-600'>{lesson.description}</p>
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
            )
          }
        ]}
      />
    </div>
  )
}
