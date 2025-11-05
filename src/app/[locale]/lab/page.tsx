import { Button } from '@/components/shadcn/button'
import CardLayout from '@/components/shared/card/CardLayout'
import { ArrowRightIcon, BookOpenIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function StemifiLabLibrary() {
  const t = useTranslations('Resource')
  const tc = useTranslations('common')
  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900'>{t('title')}</h1>
          <p className='max-w-2xl text-lg text-gray-600'>{t('description')}</p>
        </div>

        {/* Main Content */}
        <div className='grid grid-cols-1 gap-10 lg:grid-cols-2 xl:grid-cols-3'>
          {/* strawAssemblyLibrary */}
          <CardLayout
            imageClassName='object-fit'
            imageSrc='/images/resources/teacher-support.png'
            href='/lab/straw-lib'
            footer={
              <Button className='group bg-blue-500'>
                <span>{tc('button.exploreStrawLabs')}</span>
                <ArrowRightIcon className='h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Button>
            }
          >
            <div className='my-1 flex h-full flex-col justify-between px-2'>
              <div className='space-y-3'>
                {/* Header with icon */}
                <div className='flex items-center space-x-2'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100'>
                    <BookOpenIcon className='h-4 w-4 text-blue-600' />
                  </div>
                  <h2 className='text-xl font-bold text-gray-900'>{t('strawAssemblyLibrary.title')}</h2>
                </div>

                {/* Description */}
                <p className='text-sm leading-relaxed text-gray-600'>{t('strawAssemblyLibrary.description')}</p>
              </div>
            </div>
          </CardLayout>

          {/* workspace3D  */}
          <CardLayout
            imageSrc='/images/resources/courses.png'
            href='/lab/workspace-3d'
            footer={
              <Button className='group bg-blue-500'>
                <span>{tc('button.exploreWorkspace3D')}</span>
                <ArrowRightIcon className='h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Button>
            }
          >
            <div className='my-1 flex h-full flex-col justify-between px-2'>
              <div className='space-y-3'>
                {/* Header with icon */}
                <div className='flex items-center space-x-2'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100'>
                    <BookOpenIcon className='h-4 w-4 text-blue-600' />
                  </div>
                  <h2 className='text-xl font-bold text-gray-900'>{t('workspace3D.title')}</h2>
                </div>

                {/* Description */}
                <p className='text-sm leading-relaxed text-gray-600'>{t('workspace3D.description')}</p>
              </div>
            </div>
          </CardLayout>

          {/* microbitWorkspace */}
          <CardLayout
            imageSrc='/images/resources/lessons.png'
            href='/resource/lessons'
            footer={
              <Button className='group bg-blue-500'>
                <span>{tc('button.exploreMicrobitWorkspace')}</span>
                <ArrowRightIcon className='h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Button>
            }
          >
            <div className='my-1 flex h-full flex-col justify-between px-2'>
              <div className='space-y-3'>
                {/* Header with icon */}
                <div className='flex items-center space-x-2'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100'>
                    <BookOpenIcon className='h-4 w-4 text-blue-600' />
                  </div>
                  <h2 className='text-xl font-bold text-gray-900'>{t('microbitWorkspace.title')}</h2>
                </div>

                {/* Description */}
                <p className='text-sm leading-relaxed text-gray-600'>{t('microbitWorkspace.description')}</p>
              </div>
            </div>
          </CardLayout>

          {/* modalMaker */}
          <CardLayout
            imageSrc='/images/resources/news.png'
            href='/resource/activities'
            footer={
              <Button className='group bg-blue-500'>
                <span>{tc('button.exploreModalMaker')}</span>
                <ArrowRightIcon className='h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Button>
            }
          >
            <div className='my-1 flex h-full flex-col justify-between px-2'>
              <div className='space-y-3'>
                {/* Header with icon */}
                <div className='flex items-center space-x-2'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100'>
                    <BookOpenIcon className='h-4 w-4 text-blue-600' />
                  </div>
                  <h2 className='text-xl font-bold text-gray-900'>{t('modalMaker.title')}</h2>
                </div>

                {/* Description */}
                <p className='text-sm leading-relaxed text-gray-600'>{t('modalMaker.description')}</p>
              </div>
            </div>
          </CardLayout>

          {/* RobotAi */}
          <CardLayout
            imageSrc='/images/resources/activities.png'
            href='/resource/stem-kit'
            footer={
              <Button className='group bg-blue-500'>
                <span>{tc('button.exploreRobotAi')}</span>
                <ArrowRightIcon className='h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Button>
            }
          >
            <div className='my-1 flex h-full flex-col justify-between px-2'>
              <div className='space-y-3'>
                {/* Header with icon */}
                <div className='flex items-center space-x-2'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100'>
                    <BookOpenIcon className='h-4 w-4 text-blue-600' />
                  </div>
                  <h2 className='text-xl font-bold text-gray-900'>{t('robotAi.title')}</h2>
                </div>

                {/* Description */}
                <p className='text-sm leading-relaxed text-gray-600'>{t('robotAi.description')}</p>
              </div>
            </div>
          </CardLayout>
        </div>
      </div>
    </div>
  )
}
