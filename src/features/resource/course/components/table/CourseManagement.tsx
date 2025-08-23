'use client'
import React, { useEffect, useState } from 'react'
import { useSearchCourseQuery } from '../../api/courseApi'
import { useGetCourseAction } from './CourseAction'
import { Button } from '@/components/shadcn/button'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useRouter } from 'next/navigation'
import CourseListAction from '@/features/resource/course/components/list/CourseListAction'
import { useLocale, useTranslations } from 'next-intl'
import { CourseQueryParams, CourseStatus } from '@/features/resource/course/types/course.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setPageIndex, setPageSize, setParam } from '@/features/resource/course/slice/courseSlice'
import { IconPlus } from '@tabler/icons-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import Link from 'next/link'
import CardLayout from '@/components/shared/card/CardLayout'
import { Badge } from '@/components/shadcn/badge'
import { formatDuration } from '@/utils/index'
import { SPagination } from '@/components/shared/SPagination'
import { LayoutGrid, TableIcon } from 'lucide-react'

type ViewMode = 'table' | 'card'

export default function CourseManagement() {
  const t = useTranslations('Admin')
  const dispatch = useAppDispatch()
  const columns = useGetCourseAction()
  const router = useRouter()
  const locale = useLocale()

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window === 'undefined') return 'table'
    return (localStorage.getItem('course_view_mode') as ViewMode) || 'table'
  })

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('course_view_mode', viewMode)
  }, [viewMode])

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

  const handleCreate = () => {
    router.push(`/${locale}/admin/course/create`)
  }

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }
  if (!data) return null

  return (
    <div>
      <CourseListAction />
      <div className='my-4 flex items-center justify-between gap-3'>
        <Button variant='outline' size='sm' className='bg-amber-custom-400 text-white' onClick={handleCreate}>
          <IconPlus />
          <span className='hidden lg:inline'>{t('course_management.button')}</span>
        </Button>

        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
          <TabsList>
            <TabsTrigger value='table'>
              <TableIcon className='h-4 w-4' />
            </TabsTrigger>
            <TabsTrigger value='card'>
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
    </div>
  )
}
