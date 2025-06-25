'use client'

import React from 'react'

type LessonContentProps = {
  selectedId: number
}

const sectionContents: Record<number, React.ReactNode> = {
  1: <div> Content for Section 1</div>,
  2: <div> Content for Section 2</div>,
  3: <div> Content for Section 3</div>,
  4: <div> Content for Section 4</div>
}

export default function LessonContent({ selectedId }: LessonContentProps) {
  const content = sectionContents[selectedId] || <div className='text-muted-foreground'>No content available.</div>

  return (
    <div className='flex h-full items-center justify-center p-6 text-center'>
      <div className='text-muted-foreground mt-5 font-semibold'>{content}</div>
    </div>
  )
}
