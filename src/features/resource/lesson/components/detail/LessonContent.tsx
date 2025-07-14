'use client'

import { Button } from '@/components/shadcn/button'
import { useGetContentByIdQuery } from '@/features/content/api/contentApi'
import React from 'react'

type LessonContentProps = {
  selectedId?: number
}

export default function LessonContent({ selectedId }: LessonContentProps) {
  const { data } = useGetContentByIdQuery(selectedId ?? 0, { skip: !selectedId })

  return (
    <div className='h-[700px] p-6'>
      <div className='text-end'>
        <Button>Mark as Compelte</Button>
      </div>
      <div className='flex items-center justify-center text-center'>
        <div>{data?.data.contentName}</div>
      </div>
    </div>
  )
}
