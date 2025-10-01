'use client'

import { Suspense } from 'react'
import { Creator3D } from '@/features/creator-3d/components/creator3d/Creator3D'
import BackButton from '@/components/shared/button/BackButton'
import { useLocale } from 'next-intl'

export default function Create3DPage() {
  const locale = useLocale()
  return (
    <div className='h-screen w-full bg-gray-50'>
      <div className='flex h-full flex-col'>
        {/* Header */}
        <div className='border-b bg-white px-6 py-4 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <BackButton url={`/${locale}/design`} />
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>3D Assembly Creator</h1>
                <p className='text-sm text-gray-600'>Create interactive 3D assembly lessons for students</p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <button className='rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'>
                Preview
              </button>
              <button className='rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'>
                Save Assembly
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='flex flex-1 overflow-hidden'>
          <Suspense
            fallback={
              <div className='flex flex-1 items-center justify-center'>
                <div className='text-center'>
                  <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]' />
                  <p className='mt-2 text-sm text-gray-600'>Loading 3D Creator...</p>
                </div>
              </div>
            }
          >
            <Creator3D />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
