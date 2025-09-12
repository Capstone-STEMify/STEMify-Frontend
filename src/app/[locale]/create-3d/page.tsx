'use client'

import { Suspense } from 'react'
import { Creator3D } from '@/features/creator-3d/components/Creator3D'

export default function Create3DPage() {
  return (
    <div className="h-screen w-full bg-gray-50">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">3D Assembly Creator</h1>
              <p className="text-sm text-gray-600">Create interactive 3D assembly lessons for students</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Preview
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                Save Assembly
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          <Suspense fallback={
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                <p className="mt-2 text-sm text-gray-600">Loading 3D Creator...</p>
              </div>
            </div>
          }>
            <Creator3D />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

