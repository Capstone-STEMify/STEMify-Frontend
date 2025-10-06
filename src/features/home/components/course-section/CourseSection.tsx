'use client'
import { Badge } from '@/components/shadcn/badge'
import CardLayout from '@/components/shared/card/CardLayout'
import { useSearchCourseQuery } from '@/features/resource/course/api/courseApi'
import { CourseStatus } from '@/features/resource/course/types/course.type'
import { formatDuration } from '@/utils/index'
import { Clock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import React from 'react'

export default function ExploreResourcesSection() {
  const t = useTranslations('ExploreResourcesSection')
  const tc = useTranslations('common')

  const { data: CourseData } = useSearchCourseQuery({ status: CourseStatus.PUBLISHED, pageSize: 3 })

  // const truncateText = (text: string, maxLength = 80) => {
  //   if (text.length <= maxLength) return text
  //   return text.substring(0, maxLength).trim() + '...'
  // }

  if (!CourseData) return null

  return (
    <section className='relative overflow-hidden px-6 py-16'>
      <div className='absolute top-0 left-0 h-40 w-40 animate-pulse rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 opacity-20'></div>
      <div className='absolute right-0 bottom-0 h-60 w-60 rounded-full bg-gradient-to-tl from-purple-500 to-pink-500 opacity-15'></div>
      <div className='absolute top-1/2 left-1/4 h-8 w-8 animate-bounce rounded-full bg-yellow-400 opacity-40'></div>

      <div className='relative z-10'>
        <h2 className='mb-8 text-center text-5xl font-bold text-black'>
          {t('title')}
          <div className='mx-auto mt-5 h-1 w-50 rounded-full bg-gradient-to-r from-blue-400 to-purple-400' />
        </h2>
        <p className='mx-auto mb-12 max-w-4xl text-center text-lg text-gray-700'>{t('description')}</p>

        <div className='mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {CourseData.data.items.map((resource, index) => (
            <CardLayout
              className='rounded-3xl shadow-lg hover:shadow-2xl'
              imageRatio='aspect-3/2'
              key={index}
              imageSrc={resource.imageUrl || ''}
              footer={
                <div>
                  <Badge className='mr-2 bg-blue-100 text-blue-800'>{resource.ageRangeLabel} +</Badge>
                  <Badge className='bg-green-100 text-green-800'>
                    <Clock /> {formatDuration(resource.duration)}
                  </Badge>
                </div>
              }
            >
              <div className='flex min-h-0 flex-1 flex-col'>
                <p className='text-amber-custom-400 text-sm font-medium'>COURSE</p>
                <h3 className='my-2 line-clamp-2 text-xl font-semibold'>{resource.title}</h3>
                <p className='text-md line-clamp-4 text-gray-600'>{resource.description}</p>
              </div>
            </CardLayout>
          ))}
        </div>

        <div className='mt-12 text-center'>
          <Link href='/resource'>
            <button className='relative transform rounded-full bg-amber-400 px-14 py-3 text-xl font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-amber-500 hover:shadow-xl'>
              {tc('button.exploreArrow').toUpperCase()}
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

        /* hide scrollbar for the carousel */
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
