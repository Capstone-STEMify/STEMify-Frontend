'use client'
import React from 'react'
import { AssignmentDetailHeader } from './hero/AssignmentHero'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import { AssignmentTable } from './table/AssignmentTable'
import { useParams } from 'next/navigation'
import { useSearchStudentAssignmentQuery } from '../../api/studentAssignmentApi'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { AssignmentStatistics } from '../../types/assigmentlistdetail.type'

export default function AssignmentDetail() {
  const params = useParams()
  const assignmentId = params.id as string

  const {
    data: assignmentListResponse,
    isLoading,
    error
  } = useSearchStudentAssignmentQuery(
    { classroomId: 1 },
    {
      skip: !assignmentId
    }
  )

  const assignmentData: AssignmentStatistics | undefined = assignmentListResponse?.data?.items.find(
    (a) => a.assignmentId.toString() === assignmentId
  )

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
              Reviewed
            </TabsTrigger>

            <TabsTrigger
              value='not-reviewed'
              className='data-[state=active]:text-foreground data-[state=active]:border-b-primary w-auto flex-none rounded-none text-gray-400 data-[state=active]:border-b-2 data-[state=active]:border-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none'
            >
              Not Reviewed
            </TabsTrigger>
          </TabsList>

          <TabsContent value='reviewed' className='mt-6'>
            <AssignmentTable data={assignmentData} filter='reviewed' />
          </TabsContent>
          <TabsContent value='not-reviewed' className='mt-6'>
            <AssignmentTable data={assignmentData} filter='not-reviewed' />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
