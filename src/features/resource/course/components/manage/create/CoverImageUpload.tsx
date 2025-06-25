'use client'
import React from 'react'
import { Upload } from 'lucide-react'

export function CoverImageUpload() {
  return (
    <div className='rounded-lg bg-white p-6 shadow-sm'>
      <h3 className='mb-4 text-lg font-semibold'>Cover Image</h3>
      <div className='rounded-lg border-2 border-dashed border-gray-300 p-8 text-center'>
        <Upload className='mx-auto mb-4 h-12 w-12 text-sky-400' />
        <p className='mb-2 text-sm text-gray-600'>Upload cover image</p>
        <p className='text-xs text-gray-400'>make the course more engaging</p>
        <button className='mt-4 rounded-lg bg-amber-400 px-4 py-2 text-white transition-colors hover:bg-amber-500'>
          Choose File
        </button>
      </div>
    </div>
  )
}
