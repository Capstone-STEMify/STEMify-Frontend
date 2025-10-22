import { Button } from '@/components/shadcn/button'

export function WelcomeBanner() {
  return (
    <div className='flex flex-col items-center justify-between gap-8 rounded-2xl bg-white p-8 shadow-md md:flex-row'>
      <div className='flex-1 text-center md:text-left'>
        <h2 className='text-4xl font-bold text-gray-800'>Hi, Mohib 👋</h2>
        <p className='mt-2 text-2xl font-semibold text-gray-600'>What do you want to learn today with your partner?</p>
        <p className='mx-auto mt-3 max-w-lg text-gray-500 md:mx-0'>
          Discover courses, track progress, and achieve your learning goals seamlessly.
        </p>
        <Button className='mt-6 rounded-lg bg-indigo-600 px-6 py-3 hover:bg-indigo-700'>Explore Courses</Button>
      </div>

      <div className='flex-shrink-0'>
        <img src='/images/banner.png' alt='Learning Illustration' className='h-72 object-contain md:h-60' />
      </div>
    </div>
  )
}
