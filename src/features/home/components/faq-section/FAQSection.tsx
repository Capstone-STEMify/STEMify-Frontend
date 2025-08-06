import Image from 'next/image'

export default function FAQSection() {
  return (
    <section className='relative overflow-hidden bg-white px-6 py-16'>
      <div className='animate-slow-spin absolute top-0 left-0 h-44 w-44 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 opacity-15'></div>
      <div className='animate-slow-spin-reverse absolute right-0 bottom-0 h-52 w-52 rounded-full bg-gradient-to-tl from-yellow-200 to-orange-200 opacity-20'></div>
      <div className='absolute top-1/3 right-1/4 h-8 w-8 animate-pulse rounded-full bg-yellow-400 opacity-30'></div>
      <div className='absolute bottom-1/3 left-1/4 h-6 w-6 animate-bounce rounded-full bg-blue-400 opacity-40'></div>

      <div className='relative z-10 mb-12 text-center'>
        <h2 className='relative mb-4 text-3xl font-bold text-gray-900'>
          Do you still have any questions?
          <div className='absolute -bottom-2 left-1/2 h-1 w-16 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-blue-400 to-purple-400'></div>
        </h2>
        <p className='mb-8 text-gray-600'>
          Book meeting to learn is your offline materials. We will contact you in about customer care which should be
          yours.
        </p>

        <div className='relative mb-8 flex items-center justify-center space-x-4'>
          <div className='relative'>
            <input
              type='email'
              placeholder='Enter your email'
              className='w-80 rounded-lg border border-gray-300 px-4 py-3 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-yellow-400 focus:outline-none'
            />
            <div className='absolute -top-2 -right-2 h-4 w-4 rounded-full bg-yellow-300 opacity-0 transition-opacity duration-300 focus-within:animate-ping focus-within:opacity-60'></div>
          </div>
          <button className='relative transform rounded-lg bg-yellow-400 px-8 py-3 font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:bg-yellow-500 hover:shadow-xl'>
            Subscribe
            <div className='absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-orange-400 opacity-60'></div>
          </button>
        </div>
      </div>
    </section>
  )
}
