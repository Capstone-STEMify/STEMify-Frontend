'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
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
      <div className='text-end align-text-bottom'>
        <Button>Mark as Complete</Button>
      </div>
      <div>
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {data?.data.contentName}
        </ReactMarkdown>
      </div>
    </div>
  )
}
