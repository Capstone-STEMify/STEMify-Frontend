'use client'

import { useGetContentByIdQuery } from '@/features/content/api/contentApi'
import React from 'react'

type LessonContentProps = {
  selectedId?: number
}

export default function LessonContent({ selectedId }: LessonContentProps) {
  const { data } = useGetContentByIdQuery(selectedId ?? 0, { skip: !selectedId })

  return (
    <div>
      <div className='flex h-screen items-center justify-center p-6 text-center'>
        <div>{data?.data.contentName}</div>
      </div>
    </div>
  )
}
