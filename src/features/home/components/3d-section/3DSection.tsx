'use client'
import ModelCarousel from '@/features/modal3Display/ModelCarousel'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function ThreeDSection() {
  const t = useTranslations('ThreeDSection')
  const tc = useTranslations('common')
  return (
    <section className='relative overflow-hidden bg-white'>
      <div className='clip-slant absolute inset-0 h-[350px] bg-blue-50'></div>
      {/* Animated Background Elements */}
      <div className='absolute inset-0'>
        <div className='animate-float-delayed absolute right-0 bottom-60 h-40 w-40 rounded-full bg-gradient-to-tl from-blue-300 to-cyan-300 opacity-20'></div>

        {/* Floating Geometric Shapes */}
        <div className='animation-delay-500 absolute top-20 right-20 h-6 w-6 rotate-45 animate-bounce bg-blue-200/30' />
        <div className='animation-delay-1500 absolute bottom-32 left-16 h-14 w-14 animate-ping rounded-full bg-orange-200/40' />
        <div className='slow-spin absolute top-1/3 left-20 h-8 w-8 rotate-12 animate-spin bg-gradient-to-tl from-purple-500 to-pink-500 opacity-45' />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className='absolute inset-0 opacity-30'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className='relative container mx-auto flex items-center px-6 py-12 lg:py-20'>
        <div className='mx-auto flex w-full max-w-7xl flex-col items-center gap-12 lg:flex-row lg:gap-16'>
          {/* Enhanced Text Section */}
          <div className='w-full space-y-6 lg:w-1/2'>
            {/* Animated Badge */}
            <div className='animate-fade-in-up inline-flex transform items-center rounded-full bg-gradient-to-r from-orange-500 via-orange-300 to-amber-400 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:scale-105'>
              {t('badge')}
            </div>

            {/* Enhanced Title with Gradient */}
            <h1 className='animate-fade-in-up animation-delay-200 text-4xl leading-tight font-black text-gray-800 md:text-6xl'>
              {t('title')}
            </h1>

            {/* Enhanced Description */}
            <p className='animate-fade-in-up animation-delay-400 text-xl leading-relaxed text-gray-600'>
              {t('description.part1')}
              <span className='font-semibold text-gray-800'> {t('description.part2')}</span>
              {t('description.part3')}
            </p>

            {/* Action Buttons */}
            <div className='animate-fade-in-up animation-delay-600 flex flex-col gap-4 sm:flex-row'>
              <Link href='/resource'>
                <button className='group relative transform rounded-xl bg-amber-400 px-8 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl'>
                  <span className='relative z-10'>{tc('button.start')}</span>
                </button>
              </Link>

              <Link href='/resource'>
                <button className='group transform rounded-xl border border-gray-200 bg-gray-100 px-8 py-4 font-bold text-gray-700 shadow-md transition-all duration-300 hover:scale-105 hover:bg-gray-200 hover:shadow-lg'>
                  <span className='flex items-center'>
                    {tc('button.look')}
                    <svg
                      className='ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                    </svg>
                  </span>
                </button>
              </Link>
            </div>

            {/* Stats or Features */}
            <div className='animate-fade-in-up animation-delay-800 grid grid-cols-3 gap-6 pt-8'>
              <div className='text-center'>
                <div className='text-3xl font-bold text-amber-500'>100+</div>
                <div className='text-sm text-gray-500'>{t('project')}</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-amber-500'>24/7</div>
                <div className='text-sm text-gray-500'>{t('support')}</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-amber-500'>∞</div>
                <div className='text-sm text-gray-500'>{t('creative')}</div>
              </div>
            </div>
          </div>

          {/* Enhanced 3D Model Section */}
          <div className='w-full lg:w-1/2'>
            <div className='relative'>
              {/* Glowing Border Effect */}
              <div className='absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-200 via-orange-200 to-gray-200 opacity-20 blur' />

              {/* Main Container */}
              <div className='relative h-[600px] overflow-hidden rounded-2xl border border-gray-200 bg-white/90 shadow-lg backdrop-blur-sm'>
                {/* Inner Glow */}
                <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50/30 to-orange-50/30' />

                {/* Model Container */}
                <div className='relative h-full p-8'>
                  <ModelCarousel />
                </div>

                {/* Decorative Elements */}
                <div className='absolute top-4 right-4 flex space-x-2'>
                  <div className='h-3 w-3 animate-pulse rounded-full bg-red-300' />
                  <div className='animation-delay-300 h-3 w-3 animate-pulse rounded-full bg-yellow-300' />
                  <div className='animation-delay-600 h-3 w-3 animate-pulse rounded-full bg-green-300' />
                </div>

                {/* Bottom Tech Pattern */}
                <div className='absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-gray-100/50 to-transparent' />
              </div>

              {/* Floating Action Elements */}
              <div className='animation-delay-1000 absolute -right-6 -bottom-6 animate-bounce rounded-xl bg-orange-500 p-4 text-white shadow-lg'>
                <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
          opacity: 0;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-1500 {
          animation-delay: 1.5s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .slow-spin {
          animation: spin 8s linear infinite;
        }
      `}</style>
    </section>
  )
}
