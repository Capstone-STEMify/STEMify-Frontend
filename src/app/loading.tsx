import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import React from 'react'

export default function Loading() {
  return (
    <div className='flex h-screen w-full items-center justify-center'>
    <LoadingComponent size={100} textShow={true} />
    </div>
  )
}
