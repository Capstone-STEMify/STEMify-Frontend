'use client'
import React, { useEffect } from 'react'
import { useSearchCourseQuery } from '../../api/courseApi'
import { Button } from '@/components/shadcn/button'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { CourseQueryParams } from '@/features/resource/course/types/course.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setPageIndex, setPageSize } from '@/features/resource/course/slice/courseSlice'
import { IconPlus } from '@tabler/icons-react'
import Link from 'next/link'
import CardLayout from '@/components/shared/card/CardLayout'
import { Badge } from '@/components/shadcn/badge'
import { capitalizeFirst, useStatusTranslation } from '@/utils/index'
import { SPagination } from '@/components/shared/SPagination'
import { LayoutGrid, TableIcon } from 'lucide-react'
import { getLevelBadgeClass, getStatusBadgeClass } from '@/utils/badgeColor'
import STabs from '@/components/shared/STabs'
import { useGetCourseColumn } from '@/features/resource/course/components/list/CourseColum'
import { useModal } from '@/providers/ModalProvider'

export default function AdminCourseList() {
  const tc = useTranslations('common')
  const dispatch = useAppDispatch()
  const columns = useGetCourseColumn({ isPopup: false })
  const router = useRouter()
  const locale = useLocale()
  const { openModal } = useModal()
  const statusTranslation = useStatusTranslation()

  const courseParams = useAppSelector((state) => state.course)

  const queryParams: CourseQueryParams = {
    courseId: courseParams.courseId,
    createdByUserId: courseParams.createdByUserId,
    ageRangeId: courseParams.ageRangeId,
    topicId: courseParams.topicId,
    skillId: courseParams.skillId,
    standardId: courseParams.standardId,
    pageNumber: courseParams.pageNumber,
    pageSize: courseParams.pageSize,
    search: courseParams.search,
    status: courseParams.status,
    orderBy: 'createdDate',
    sortDirection: 'Desc'
  }

  useEffect(() => {
    dispatch(setPageSize(10))
  }, [dispatch])

  const { data } = useSearchCourseQuery(queryParams)

  const rows = React.useMemo(() => data?.data.items ?? [], [data])

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }
  if (!data) return null

  return (
    <div>
      <STabs
        className='mt-4'
        defaultValue={'card'}
        additionalContent={{
          leftSide: (
            <div className='flex items-center justify-between gap-3'>
              <Button
                variant='outline'
                size='sm'
                className='bg-amber-custom-400 text-white'
                onClick={() => {
                  openModal('upsertCourse')
                }}
              >
                <IconPlus />
                <span className='hidden lg:inline'>{tc('button.add')}</span>
              </Button>
            </div>
          )
        }}
        items={[
          {
            value: 'card',
            label: <LayoutGrid className='h-4 w-4' />,
            content: (
              <div className='px-2'>
                <div className='grid h-fit grid-cols-1 justify-items-center gap-5 py-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
                  {rows.map((course: any) => (
                    <Link key={course.id} href={`/${locale}/admin/course/${course.id}`}>
                      <CardLayout
                        imageSrc={course.imageUrl}
                        badge={
                          <Badge className={`${getStatusBadgeClass(course.status)}`}>
                            {statusTranslation(course.status)}
                          </Badge>
                        }
                        footer={
                          <div>
                            {course.duration > 0 && (
                              <Badge className={getLevelBadgeClass(course.level)}>
                                {tc(`level.${course.level.toLowerCase()}`)}
                              </Badge>
                            )}
                          </div>
                        }
                      >
                        <div>
                          <p className='text-muted-foreground text-xs font-medium'>{course.code}</p>
                          <h3 className='line-clamp-1 text-sm font-semibold text-gray-900'>{course.title}</h3>
                          <p className='line-clamp-2 text-xs text-gray-600'>{course.description}</p>
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
          },
          {
            value: 'table',
            label: <TableIcon className='h-4 w-4' />,
            content: (
              <DataTable
                data={rows}
                columns={columns}
                enableRowSelection
                pagingData={data}
                pagingParams={queryParams}
                handlePageChange={handlePageChange}
              />
            )
          }
        ]}
      />
    </div>
  )
}
