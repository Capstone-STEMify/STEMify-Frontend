'use client'
import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import Image from 'next/image'

type LoadingProps = {
  size?: number
  textShow?: boolean
}

export default function LoadingComponent({ size = 75, textShow = true }: LoadingProps) {
  // return <DotLottieReact src='/animations/loading.lottie' loop autoplay style={{ width: size, height: size }} />
  return (
    <div className='flex flex-col items-center justify-center'>
      <Image src='/images/loading.gif' alt='Loading Cat' width={size} height={size} />
      {textShow && <p className='mt-4 text-[#8b949e]'>One moment please...</p>}
    </div>
  )
}
