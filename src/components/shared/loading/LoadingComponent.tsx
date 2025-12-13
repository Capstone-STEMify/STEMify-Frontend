'use client'
import React from 'react'
import { Loader2 } from 'lucide-react'

type LoadingProps = {
  size?: number
  textShow?: boolean
  text?: string
}

export default function LoadingComponent({ size = 32, textShow = true, text }: LoadingProps) {
  return (
    <div className='flex flex-col items-center justify-center gap-3'>
      <Loader2 className='animate-spin text-blue-500' size={size} />

      {/* {textShow && <p className='text-muted-foreground text-sm'>{text || 'One moment please...'}</p>} */}
    </div>
  )
}
