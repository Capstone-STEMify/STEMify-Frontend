'use client'

import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import CardLayout from '@/components/shared/card/CardLayout'
import UserForm from '@/components/shared/form/UserForm'
import RichTextEditor from '@/components/shared/rich-text-editor'
import { useModal } from '@/providers/ModalProvider'
import { Pencil } from 'lucide-react'
import { useState } from 'react'

export default function Test() {
  const [post, setPost] = useState('')
  const { openModal } = useModal()
  const onChange = (content: string) => {
    setPost(content)
    console.log(content)
  }

  return (
    <div className=''>
      <div className='mx-auto flex max-w-4xl flex-wrap gap-4'>
        <CardLayout
          imageSrc='https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?...'
          size='lg'
          infor={
            <div className='flex items-center gap-2'>
              <Badge className='bg-opacity-80 rounded-2xl bg-gray-200 px-4 py-1 text-black opacity-75 backdrop-blur-sm'>
                abc
              </Badge>
              <Badge className='bg-opacity-80 rounded-2xl bg-gray-200 px-4 py-1 text-black opacity-75 backdrop-blur-sm'>
                hahahah
              </Badge>
            </div>
          }
          badge={
            <>
              <Badge className='bg-opacity-80 rounded-2xl bg-gray-200 px-4 py-2 text-black opacity-75 backdrop-blur-sm'>
                abc
              </Badge>
              <Badge className='bg-opacity-80 rounded-2xl bg-gray-200 px-4 text-black opacity-75 backdrop-blur-sm'>
                dcm
              </Badge>
            </>
          }
          action={
            <button className='rounded-full bg-white p-1 hover:bg-gray-100'>
              <Pencil className='h-4 w-4 text-gray-500' />
            </button>
          }
        >
          <div className='flex h-full flex-col space-y-1'>
            <h3 className='text-sm font-semibold'>Lesson</h3>
            <p className='text-xs text-gray-500'>Intro to Arduino</p>
            <p className='text-xs text-gray-500'>
              Learn how to use sensors, control motors, and build your first circuit.
            </p>
            <div className='mt-auto flex justify-end'>
              <button className='rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600'>Submit</button>
            </div>
          </div>
        </CardLayout>
      </div>
      <Button className='bg-blue-300 py-2' onClick={() => openModal('userForm')}>
        open user form
      </Button>

      <UserForm />
      <RichTextEditor content={post} onChange={onChange} />
    </div>
  )
}
