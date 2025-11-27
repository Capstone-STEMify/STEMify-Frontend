'use client'
import React from 'react'
import { AssignmentDetailHeader } from './hero/AssignmentHero'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import { AssignmentTable } from './table/AssignmentTable'
import { useParams } from 'next/navigation'
import { useGetAssignmentDetailByIdQuery, useSearchStudentAssignmentQuery } from '../../api/studentAssignmentApi'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { AssignmentStatistics } from '../../types/assigmentlistdetail.type'
import { useTranslations } from 'next-intl'

export default function AssignmentDetail() {
  const params = useParams()
  const assignmentId = params.assignmentId as string
  const classroomId = params.classroomId as string

  const tc = useTranslations('common')

  const {
    data: assignmentStatisticsResponse,
    isLoading,
    error,
    refetch
  } = useGetAssignmentDetailByIdQuery(
    { classroomId: Number(classroomId), assignmentId: Number(assignmentId) },
    {
      skip: !assignmentId || !classroomId
    }
  )

  const assignmentData: AssignmentStatistics | undefined = assignmentStatisticsResponse?.data

  if (isLoading) return <LoadingComponent />
  if (error) return <div className='p-8'>Error loading assignment data.</div>
  if (!assignmentData) return <div className='p-8'>Assignment not found.</div>

  return (
    <div className='min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-7xl'>
        <AssignmentDetailHeader data={assignmentData} />

        <Tabs defaultValue='not-reviewed' className='mt-6'>
          <TabsList className='w-full justify-start rounded-none border-b bg-transparent p-0'>
            <TabsTrigger
              value='reviewed'
              className='data-[state=active]:text-foreground data-[state=active]:border-b-primary w-auto flex-none rounded-none text-gray-400 data-[state=active]:border-b-2 data-[state=active]:border-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none'
            >
              {tc('button.reviewed')}
            </TabsTrigger>

            <TabsTrigger
              value='not-reviewed'
              className='data-[state=active]:text-foreground data-[state=active]:border-b-primary w-auto flex-none rounded-none text-gray-400 data-[state=active]:border-b-2 data-[state=active]:border-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none'
            >
              {tc('button.notReviewed')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value='reviewed' className='mt-6'>
            <AssignmentTable data={assignmentData} filter='reviewed' onRefresh={() => refetch?.()} />
          </TabsContent>
          <TabsContent value='not-reviewed' className='mt-6'>
            <AssignmentTable data={assignmentData} filter='not-reviewed' onRefresh={() => refetch?.()} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
