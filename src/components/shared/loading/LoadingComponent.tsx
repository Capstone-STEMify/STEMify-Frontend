'use client'
import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

type LoadingProps = {
  size?: number
}

export default function LoadingComponent({ size = 75 }: LoadingProps) {
  return <DotLottieReact src='/animations/loading.lottie' loop autoplay style={{ width: size, height: size }} />
}
