import { BookOpen } from 'lucide-react'

export default function ClassroomHero() {
  return (
    <div className='mt-24 h-fit overflow-hidden'>
      <div className='relative overflow-hidden bg-gradient-to-br from-blue-600 via-sky-600 to-yellow-600 px-8 py-10 text-white'>
        {/* Animated Background Elements */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute -top-10 -right-10 h-40 w-40 animate-pulse rounded-full bg-white/10 blur-3xl' />
          <div className='absolute -bottom-10 -left-10 h-32 w-32 animate-pulse rounded-full bg-white/10 blur-2xl' />
          <div className='absolute top-1/2 left-1/2 h-24 w-24 animate-pulse rounded-full bg-white/5 blur-xl' />
        </div>

        <div className='relative z-10 mx-auto max-w-7xl'>
          <div className='mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm'>
            <BookOpen className='h-4 w-4' />
            <span className='text-sm font-medium'>STEMmify Education</span>
          </div>
          <h1 className='mb-4 text-4xl font-bold md:text-5xl'>Welcome back! 👋</h1>
          <p className='text-xl text-white/90 md:text-2xl'>Don’t be afraid to make mistakes. That’s how you learn</p>
        </div>
      </div>
    </div>
  )
}
