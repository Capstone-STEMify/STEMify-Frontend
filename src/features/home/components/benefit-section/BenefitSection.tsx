'use client'
import { Star } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function BenefitsSection() {
  const t = useTranslations('BenefitSection')

  const benefits = [t('benefit1'), t('benefit2'), t('benefit3')]

  return (
    <section className='relative overflow-hidden bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8'>
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
                className='w-full transform rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105'
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
                  <div className='absolute -top-1 -right-1 h-2 w-2 animate-ping rounded-full bg-orange-400'></div>
                </div>
                <span className='text-xs text-gray-600 sm:text-sm'>{t('status')}</span>
              </div>

              {/* Title */}
              <h2 className='relative mb-6 text-2xl font-bold text-gray-900 sm:text-3xl lg:mb-8 lg:text-4xl'>
                {t.rich('title', {
                  orange: (chunks) => (
                    <span className='relative text-orange-500'>
                      {chunks}
                      <div className='absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 opacity-60 sm:h-1'></div>
                    </span>
                  )
                })}
              </h2>

              {/* Benefits list */}
              <ul className='space-y-3 sm:space-y-4'>
                {benefits.map((benefit, index) => (
                  <li key={index} className='group flex items-start justify-center space-x-3 lg:justify-start'>
                    <div className='relative mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 transition-transform duration-300 group-hover:scale-110 sm:h-6 sm:w-6'>
                      <span className='text-xs text-white sm:text-sm'>✓</span>
                      <div className='absolute -top-1 -right-1 h-2 w-2 animate-ping rounded-full bg-blue-300 opacity-60 group-hover:animate-pulse sm:h-3 sm:w-3'></div>
                    </div>
                    <span className='text-sm text-gray-700 transition-colors duration-300 group-hover:text-gray-900 sm:text-base lg:text-left'>
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
