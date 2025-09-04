import { useTranslations } from 'next-intl'

export default function FAQSection() {
  const t = useTranslations('FAQSection')
  const tc = useTranslations('common')
  return (
    <section className='relative overflow-hidden bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8'>
      {/* Decorative elements - adjusted for responsive */}
      <div className='animate-slow-spin absolute top-0 left-0 h-32 w-32 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 opacity-15 sm:h-44 sm:w-44'></div>
      <div className='animate-slow-spin-reverse absolute right-0 bottom-0 h-40 w-40 rounded-full bg-gradient-to-tl from-yellow-200 to-orange-200 opacity-20 sm:h-52 sm:w-52'></div>
      <div className='absolute top-1/3 right-1/4 h-6 w-6 animate-pulse rounded-full bg-yellow-400 opacity-30 sm:h-8 sm:w-8'></div>
      <div className='absolute bottom-1/3 left-1/4 h-4 w-4 animate-bounce rounded-full bg-blue-400 opacity-40 sm:h-6 sm:w-6'></div>

      <div className='relative z-10 mx-auto max-w-4xl'>
        {/* Header section */}
        <div className='mb-8 text-center sm:mb-12'>
          <h2 className='relative mb-3 text-2xl font-bold text-gray-900 sm:mb-4 sm:text-3xl lg:text-4xl'>
            {t('title')}
            <div className='absolute -bottom-1 left-1/2 h-0.5 w-12 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-blue-400 to-purple-400 sm:-bottom-2 sm:h-1 sm:w-16'></div>
          </h2>
          <p className='mb-6 text-sm text-gray-600 sm:mb-8 sm:text-base lg:text-lg'>{t('description')}</p>
        </div>

        {/* Email subscription section */}
        <div className='relative flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'>
          <div className='relative w-full max-w-xs sm:max-w-sm lg:max-w-md'>
            <input
              type='email'
              placeholder={t('emailPlaceholder')}
              className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-yellow-400 focus:outline-none sm:px-4 sm:py-3 sm:text-base'
            />
            <div className='absolute -top-1 -right-1 h-3 w-3 rounded-full bg-yellow-300 opacity-0 transition-opacity duration-300 focus-within:animate-ping focus-within:opacity-60 sm:-top-2 sm:-right-2 sm:h-4 sm:w-4'></div>
          </div>
          <button className='relative w-full max-w-xs transform rounded-lg bg-yellow-400 px-6 py-2.5 text-sm font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:bg-yellow-500 hover:shadow-xl sm:w-auto sm:px-8 sm:py-3 sm:text-base'>
            {tc('button.subscribe')}
            <div className='absolute -top-0.5 -right-0.5 h-2 w-2 animate-pulse rounded-full bg-orange-400 opacity-60 sm:-top-1 sm:-right-1 sm:h-3 sm:w-3'></div>
          </button>
        </div>
      </div>
    </section>
  )
}
