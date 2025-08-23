'use client'
import React, { useEffect, useState } from 'react'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useGetLessonAction } from './LessonAction'
import { useSearchLessonQuery } from '../../api/lessonApi'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setPageIndex, setPageSize } from '@/features/resource/lesson/slice/lessonSlice'
import { LessonQueryParams } from '@/features/resource/lesson/types/lesson.type'
import LessonListAction from '../list/LessonListAction'
import { Button } from '@/components/shadcn/button'
import { IconPlus } from '@tabler/icons-react'
import { useLocale } from 'next-intl'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import Link from 'next/link'
import CardLayout from '@/components/shared/card/CardLayout'
import { Badge } from '@/components/shadcn/badge'
import { SPagination } from '@/components/shared/SPagination'
import { formatDuration } from '@/utils/index'
import { LayoutGrid, TableIcon } from 'lucide-react'

type ViewMode = 'table' | 'card'

export default function LessonManagement({ courseIdSelected }: { courseIdSelected?: number }) {
  const locale = useLocale()
  const router = useRouter()
  const columns = useGetLessonAction()

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
    orderBy: 'createdDate',
    sortDirection: 'Desc'
  }

  useEffect(() => {
    dispatch(setPageSize(10))
  }, [dispatch])

  const { data } = useSearchLessonQuery(queryParams)

  const rows = React.useMemo(() => data?.data.items ?? [], [data])

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }
  const handleCreate = () => {
    router.push(`/${locale}/admin/lesson/create?courseId=${courseIdSelected}`)
  }

  if (!data) return null

  return (
    <div>
      <LessonListAction />
      <div className='my-4 flex items-center justify-between gap-3'>
        {courseIdSelected && (
          <Button
            variant='outline'
            size='sm'
            className='bg-amber-custom-400 my-5 cursor-pointer text-white'
            onClick={handleCreate}
          >
            <IconPlus />
            <span className='hidden lg:inline'>Add New</span>
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
        {/* TABLE VIEW */}
        <TabsContent value='table'>
          <DataTable
            data={rows}
            columns={columns}
            enableRowSelection
            pagingData={data}
            pagingParams={queryParams}
            handlePageChange={handlePageChange}
            className='mt-5'
          />
        </TabsContent>

        {/* CARD VIEW */}
        <TabsContent value='card'>
          <div className='px-2'>
            <div className='grid h-fit grid-cols-1 justify-items-center gap-y-10 py-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6'>
              {rows.map((course: any) => (
                <Link key={course.id} href={`/${locale}/admin/course/${course.id}`} className='w-full'>
                  <CardLayout imageSrc={course.imageUrl} size='sm'>
                    <div>
                      <p className='text-muted-foreground text-xs font-medium'>{course.code}</p>
                      <h3 className='line-clamp-1 text-sm font-semibold text-gray-900'>{course.title}</h3>
                      <p className='line-clamp-2 text-xs text-gray-600'>{course.description}</p>
                    </div>

                    <div className='mt-auto flex flex-wrap items-center gap-2'>
                      {course.ageRangeLabel && <Badge className='bg-sky-custom-300'>{course.ageRangeLabel}</Badge>}
                      {course.duration && <Badge className='bg-red-300'>{formatDuration(course.duration)}</Badge>}
                      {course.level && <Badge className='bg-emerald-200'>{String(course.level).toUpperCase()}</Badge>}
                      {course.status && <Badge className='bg-blue-200'>{String(course.status).toUpperCase()}</Badge>}
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

      <DataTable
        data={rows}
        columns={columns}
        enableRowSelection
        pagingData={data}
        pagingParams={queryParams}
        handlePageChange={handlePageChange}
        className='mt-5'
      />
    </div>
  )
}
