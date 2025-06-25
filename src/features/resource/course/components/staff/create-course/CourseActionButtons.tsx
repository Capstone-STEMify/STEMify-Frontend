'use client'
import React from 'react'
import Link from 'next/link'

export function CourseActionButtons() {
  return (
    <div className='flex flex-col gap-3 sm:flex-row'>
      <Link href={'https://localhost:3000/teacher/course-management/create-course/create-lesson'}>
        <button className='flex-1 rounded-lg bg-amber-400 px-6 py-3 font-medium text-white transition-colors hover:bg-amber-500'>
          Save Course
        </button>
      </Link>
      <button className='flex-1 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50'>
        Preview
      </button>
    </div>
  )
}
