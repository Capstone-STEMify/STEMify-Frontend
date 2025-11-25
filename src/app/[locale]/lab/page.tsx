'use client'
import { Button } from '@/components/shadcn/button'
import CardLayout from '@/components/shared/card/CardLayout'
import { useAppSelector } from '@/hooks/redux-hooks'
import { ArrowRightIcon, BookOpenIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function StemifiLabLibrary() {
  const t = useTranslations('Resource')
  const tc = useTranslations('common')
  const { token, user } = useAppSelector((state) => state.auth)
  const userId = user?.userId
  const redirectUrl =
    process.env.NEXT_PUBLIC_MICROBIT_URL ?? 'https://white-cliff-0cc49e300.3.azurestaticapps.net/index.html'

  return (
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
          imageSrc='/images/resources/lessons.png'
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
          imageSrc='/images/resources/sim.gif'
          onClick={() => {
            const win = window.open('about:blank')
            if (!win) return

            win.document.open()
            win.document.write(`
              <script>
                const REDIRECT_URL = "${redirectUrl}";
                window.addEventListener("message", function(event) {
                  // Save into window.name (cross-domain safe)
                  window.name = JSON.stringify(event.data);
                  window.location.href = REDIRECT_URL;
                });
              </script>
            `)
            win.document.close()

            // Delay để tab mới load xong script
            setTimeout(() => {
              console.log('Sending SSO message:', token, userId)
              win.postMessage({ source: 'stemify-sso', token, userId }, '*')
            }, 150)
          }}
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
          imageSrc='/images/resources/ai_drawbridge_cover.webp'
          href='/lab/model-maker'
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
          href='/lab/microbit-ai'
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
  )
}
