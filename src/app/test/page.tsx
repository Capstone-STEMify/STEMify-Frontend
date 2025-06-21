'use client'

import RichTextEditor from '@/components/shared/rich-text-editor'
import { useModal } from '@/providers/ModalProvider'
import { useState } from 'react'
export default function Test() {
  const [post, setPost] = useState('')
  const onChange = (content: string) => {
    setPost(content)
    console.log(content)
  }

  return (
    <div className='my-8'>
      <RichTextEditor content={post} onChange={onChange} />
    </div>
  )
}
