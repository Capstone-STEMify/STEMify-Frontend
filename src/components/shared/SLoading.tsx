import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import React from 'react'

export default function SLoading() {
  return (
    <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
      <LoadingComponent size={150} />
    </div>
  )
}
