'use client'

import { Button } from '@/components/shadcn/button'
import CardLayout from '@/components/shared/card/CardLayout'
import { ArrowRightIcon, BookOpenIcon } from 'lucide-react'

export default function LibraryPage() {
  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900'>Library</h1>
          <p className='max-w-2xl text-lg text-gray-600'>
            Curated courses, curriculum-aligned lessons, engaging activities, and support materials made by expert
            teachers.
          </p>
        </div>

        {/* Main Content */}
        <div className='grid grid-cols-1 gap-20 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {/* Courses */}

          <CardLayout imageSrc='/images/resources/courses.png' size='lg' href='/resource/courses'>
            <div className='my-1 flex h-full flex-col justify-between px-2'>
              <div className='space-y-3'>
                {/* Header with icon */}
                <div className='flex items-center space-x-2'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100'>
                    <BookOpenIcon className='h-4 w-4 text-blue-600' />
                  </div>
                  <h2 className='text-xl font-bold text-gray-900'>Courses</h2>
                </div>

                {/* Description */}
                <p className='text-sm leading-relaxed text-gray-600'>
                  Comprehensive courses designed to enhance STEM learning and accelerate your career growth.
                </p>
              </div>

              <Button className='group bg-blue-500'>
                <span>Explore Courses</span>
                <ArrowRightIcon className='h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Button>
            </div>
          </CardLayout>

          <CardLayout imageSrc='/images/resources/lessons.png' size='lg' href='/resource/lessons'>
            <div className='my-1 flex h-full flex-col justify-between px-2'>
              <div className='space-y-3'>
                {/* Header with icon */}
                <div className='flex items-center space-x-2'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100'>
                    <BookOpenIcon className='h-4 w-4 text-blue-600' />
                  </div>
                  <h2 className='text-xl font-bold text-gray-900'>Lessons</h2>
                </div>

                {/* Description */}
                <p className='text-sm leading-relaxed text-gray-600'>
                  Engaging lessons aligned with curriculum standards to foster critical thinking and problem-solving
                  skills.
                </p>
              </div>

              <Button className='group bg-blue-500'>
                <span>Explore Lessons</span>
                <ArrowRightIcon className='h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Button>
            </div>
          </CardLayout>

          <CardLayout imageSrc='/images/resources/activities.png' size='lg' href='/resource/activities'>
            <div className='my-1 flex h-full flex-col justify-between px-2'>
              <div className='space-y-3'>
                {/* Header with icon */}
                <div className='flex items-center space-x-2'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100'>
                    <BookOpenIcon className='h-4 w-4 text-blue-600' />
                  </div>
                  <h2 className='text-xl font-bold text-gray-900'>Activities</h2>
                </div>

                {/* Description */}
                <p className='text-sm leading-relaxed text-gray-600'>
                  Interactive activities designed to make learning fun and engaging, enhancing student participation and
                  understanding.
                </p>
              </div>

              <Button className='group bg-blue-500'>
                <span>Explore Activities</span>
                <ArrowRightIcon className='h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Button>
            </div>
          </CardLayout>

          <CardLayout imageSrc='/images/resources/teacher-support.png' size='lg' href='/resource/teacher-support'>
            <div className='my-1 flex h-full flex-col justify-between px-2'>
              <div className='space-y-3'>
                {/* Header with icon */}
                <div className='flex items-center space-x-2'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100'>
                    <BookOpenIcon className='h-4 w-4 text-blue-600' />
                  </div>
                  <h2 className='text-xl font-bold text-gray-900'>Teacher Support</h2>
                </div>

                {/* Description */}
                <p className='text-sm leading-relaxed text-gray-600'>
                  Resources and support materials for teachers to enhance their teaching effectiveness and student
                  outcomes.
                </p>
              </div>

              <Button className='group bg-blue-500'>
                <span>Get Help</span>
                <ArrowRightIcon className='h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Button>
            </div>
          </CardLayout>

          <CardLayout imageSrc='/images/resources/news.png' size='lg' href='/resource/news'>
            <div className='my-1 flex h-full flex-col justify-between px-2'>
              <div className='space-y-3'>
                {/* Header with icon */}
                <div className='flex items-center space-x-2'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100'>
                    <BookOpenIcon className='h-4 w-4 text-blue-600' />
                  </div>
                  <h2 className='text-xl font-bold text-gray-900'>News and blogs</h2>
                </div>

                {/* Description */}
                <p className='text-sm leading-relaxed text-gray-600'>
                  Stay updated with the latest news, trends, and insights in STEM education through our blogs and
                  articles.
                </p>
              </div>

              <Button className='group bg-blue-500'>
                <span>Read Blogs</span>
                <ArrowRightIcon className='h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Button>
            </div>
          </CardLayout>
        </div>
      </div>
    </div>
  )
}
