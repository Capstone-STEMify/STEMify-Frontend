import React from 'react'
import { AssignmentDetailHeader } from './hero/AssignmentHero'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import { AssignmentTable } from './table/AssignmentTable'

export default function AssignmentDetail() {
  return (
    <div className='min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-7xl'>
        <AssignmentDetailHeader />

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
            <AssignmentTable filter="reviewed" />
          </TabsContent>
          <TabsContent value='not-reviewed' className='mt-6'>
            <AssignmentTable filter="not-reviewed" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}