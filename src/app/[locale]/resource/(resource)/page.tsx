import { Button } from '@/components/shadcn/button'
import CardLayout from '@/components/shared/card/CardLayout'
import { ArrowRightIcon, BookOpenIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function LibraryPage() {
  const t = useTranslations('Resource')
  const tc = useTranslations('common')
  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900'>{t('title')}</h1>
          <p className='max-w-2xl text-lg text-gray-600'>
            {t('description')}
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
                  <h2 className='text-xl font-bold text-gray-900'>{t('courses.title')}</h2>
                </div>

                {/* Description */}
                <p className='text-sm leading-relaxed text-gray-600'>
                  {t('courses.description')}
                </p>
              </div>

              <Button className='group bg-blue-500'>
                <span>{tc('button.exploreCourses')}</span>
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
                  <h2 className='text-xl font-bold text-gray-900'>{t('lessons.title')}</h2>
                </div>

                {/* Description */}
                <p className='text-sm leading-relaxed text-gray-600'>
                  {t('lessons.description')}
                </p>
              </div>

              <Button className='group bg-blue-500'>
                <span>{tc('button.exploreLessons')}</span>
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
                  <h2 className='text-xl font-bold text-gray-900'>{t('activities.title')}</h2>
                </div>

                {/* Description */}
                <p className='text-sm leading-relaxed text-gray-600'>
                  {t('activities.description')}
                </p>
              </div>

              <Button className='group bg-blue-500'>
                <span>{tc('button.exploreActivities')}</span>
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
                  <h2 className='text-xl font-bold text-gray-900'>{t('support.title')}</h2>
                </div>

                {/* Description */}
                <p className='text-sm leading-relaxed text-gray-600'>
                  {t('support.description')}
                </p>
              </div>

              <Button className='group bg-blue-500'>
                <span>{tc('button.getHelp')}</span>
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
                  <h2 className='text-xl font-bold text-gray-900'>{t('news.title')}</h2>
                </div>

                {/* Description */}
                <p className='text-sm leading-relaxed text-gray-600'>
                  {t('news.description')}
                </p>
              </div>

              <Button className='group bg-blue-500'>
                <span>{tc('button.readBlogs')}</span>
                <ArrowRightIcon className='h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Button>
            </div>
          </CardLayout>
        </div>
      </div>
    </div>
  )
}
