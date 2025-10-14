'use client'
import { Button } from '@/components/shadcn/button'
import { Star } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function BenefitsSection() {
  const t = useTranslations('BenefitSection')
  const tc = useTranslations('common')

  const benefits = [t('benefit1'), t('benefit2'), t('benefit3')]
  const benefitsDesc = [t('benefit1Desc'), t('benefit2Desc'), t('benefit3Desc')]

  return (
    <section className='relative min-h-[130vh] overflow-hidden bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8'>
      <div className='absolute top-0 right-0 h-32 w-32 animate-pulse rounded-full bg-gradient-to-bl from-orange-200 to-yellow-200 opacity-20 sm:h-40 sm:w-40 lg:h-48 lg:w-48'></div>
      <div className='animate-float absolute bottom-0 left-0 h-24 w-24 rounded-full bg-gradient-to-tr from-blue-200 to-cyan-200 opacity-30 sm:h-28 sm:w-28 lg:h-32 lg:w-32'></div>
      <div className='absolute top-1/2 left-4 h-4 w-4 animate-ping rounded-full bg-yellow-400 opacity-50 sm:left-6 sm:h-5 sm:w-5 lg:left-10 lg:h-6 lg:w-6'></div>
      <div className='absolute top-1/4 right-1/4 h-3 w-3 animate-bounce rounded-full bg-orange-400 opacity-60 sm:h-4 sm:w-4'></div>

      <div className='relative z-10 mx-auto max-w-7xl'>
        <div className='flex flex-col items-center lg:flex-row lg:items-center lg:justify-between lg:space-x-12'>
          {/* Image section */}
          <div className='mb-8 w-full lg:mb-0 lg:flex-1'>
            <div className='group relative mx-auto max-w-md sm:max-w-lg lg:max-w-none'>
              <Image
                width={600}
                height={300}
                src='/HomeFiles/learning.png'
                alt='Students collaborating'
                className='w-full transform rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105'
              />
              <div className='absolute -top-2 -left-2 -z-10 h-full w-full rounded-lg bg-gradient-to-br from-blue-300 to-purple-300 opacity-20 transition-opacity duration-300 group-hover:opacity-30 sm:-top-3 sm:-left-3 lg:-top-4 lg:-left-4'></div>
              <div className='absolute -right-2 -bottom-2 -z-20 h-full w-full rounded-lg bg-gradient-to-tl from-yellow-300 to-orange-300 opacity-15 transition-opacity duration-300 group-hover:opacity-25 sm:-right-3 sm:-bottom-3 lg:-right-4 lg:-bottom-4'></div>
            </div>
          </div>

          {/* Content section */}
          <div className='w-full text-center lg:flex-1 lg:text-left'>
            <div className='mx-auto max-w-lg lg:mx-0 lg:max-w-none'>
              {/* Status badge */}
              <div className='mb-4 flex items-center justify-center space-x-2 lg:mb-6 lg:justify-start'>
                <div className='relative'>
                  <Star className='h-4 w-4 fill-current text-yellow-400 sm:h-5 sm:w-5' />
                  <div className='absolute -top-1 -right-1 h-2 w-2 rounded-full bg-orange-400'></div>
                </div>
                <span className='text-xs text-gray-600 sm:text-sm'>{t('status')}</span>
              </div>

              {/* Title */}
              <h1 className='relative mb-6 text-5xl font-extrabold text-blue-800'>{t('title')}</h1>

              {/* Benefits list */}
              <div className='space-y-6'>
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className='flex items-start rounded-xl bg-white p-4 shadow-md transition hover:shadow-lg sm:p-6'
                  >
                    {/* Icon */}
                    <div className='flex-shrink-0'>
                      {/* Bạn có thể thay bằng icon động (lucide-react, heroicons) */}
                      <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600'>
                        <Star className='h-6 w-6' />
                      </div>
                    </div>

                    {/* Text content */}
                    <div className='ml-4'>
                      <h3 className='text-base font-semibold text-gray-900 sm:text-lg'>{benefit}</h3>
                      <p className='mt-1 text-sm text-gray-600 sm:text-base'>{benefitsDesc[index]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className='absolute inset-0 mt-100 bg-cover bg-center'
        style={{
          backgroundImage: "url('https://strawbees.com/hubfs/2024_home_classroom_features_4-1-1.jpg')",
          clipPath: 'polygon(0 45%, 100% 0, 100% 100%, 0% 100%)'
        }}
      ></div>
    </section>
  )
}
