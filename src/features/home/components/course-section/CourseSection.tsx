'use client'
import { Badge } from '@/components/shadcn/badge'
import CardLayout from '@/components/shared/card/CardLayout'
import { useGetAllCourseQuery } from '@/features/resource/course/api/courseApi'
import { formatDuration } from '@/utils/index'
import Link from 'next/link'
import React from 'react'

export default function ExploreResourcesSection() {
  const { data: CourseData, error, isLoading } = useGetAllCourseQuery()

  const truncateText = (text: string, maxLength = 80) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  return (
    <section className='relative overflow-hidden px-6 py-16'>
      <div className='absolute top-0 left-0 h-40 w-40 animate-pulse rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 opacity-20'></div>
      <div className='animate-slow-spin absolute right-0 bottom-0 h-60 w-60 rounded-full bg-gradient-to-tl from-purple-500 to-pink-500 opacity-15'></div>
      <div className='absolute top-1/2 left-1/4 h-8 w-8 animate-bounce rounded-full bg-yellow-400 opacity-40'></div>

      <div className='relative z-10'>
        <h2 className='mb-12 text-center text-5xl font-bold text-black'>
          Explore resources
          <div className='mx-auto mt-5 h-1 w-50 rounded-full bg-gradient-to-r from-blue-400 to-purple-400' />
        </h2>

        <div className='mx-auto flex max-w-7xl justify-around gap-6'>
          {CourseData?.data.items.slice(1, 4).map((resource, index) => (
            <CardLayout
              size='lg'
              key={index}
              imageSrc={resource.imageUrl}
              infor={<Badge>{resource.categoryNames}</Badge>}
            >
              <div className='flex min-h-0 flex-1 flex-col'>
                <h3 className='text-lg font-semibold'>{resource.title}</h3>
                <p className='text-sm text-gray-600'>{truncateText(resource.description)}</p>
                {/* footer */}
                <div className='mt-auto flex items-center gap-2'>
                  <Badge className='bg-blue-100 text-blue-800'>{resource.ageRangeLabel}</Badge>
                  <Badge className='bg-green-100 text-green-800'>{formatDuration(resource.duration)}</Badge>
                </div>
              </div>
            </CardLayout>
          ))}
        </div>

        <div className='mt-12 text-center'>
          <Link href='/resource'>
            <button className='relative transform rounded-full bg-amber-400 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-amber-500 hover:shadow-xl'>
              Explore →
              <div className='absolute -top-1 -right-1 h-4 w-4 animate-pulse rounded-full bg-pink-400 opacity-60'></div>
            </button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes slow-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-slow-spin {
          animation: slow-spin 20s linear infinite;
        }
      `}</style>
    </section>
  )
}
