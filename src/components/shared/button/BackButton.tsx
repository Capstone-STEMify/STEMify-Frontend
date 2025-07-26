'use client'

import { Button } from '@/components/shadcn/button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
  url?: string
}

export default function BackButton({ url }: Props) {
  const router = useRouter()

  function goBack() {
    if (url) {
      router.push(url)
    } else {
      router.back()
    }
  }

  return (
    <Button onClick={goBack} variant='secondary' className='cursor-pointer'>
      <ChevronLeft className='link text-gray-600 hover:text-black' />
    </Button>
  )
}
