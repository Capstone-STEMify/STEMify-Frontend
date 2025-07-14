import MacCard from '@/components/shared/card/MacCard'
import React, { useEffect, useState } from 'react'

export default function LearningSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    const element = document.getElementById('stem-section')
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section id='stem-section' className='bg-gray-50 py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 items-center gap-16 lg:grid-cols-2'>
          <div
            className={`transition-all delay-200 duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'} rounded-2xl border-4 border-violet-900`}
          >
            <MacCard>
              <img src='/images/macbg.png' alt='STEMify Learning' className='h-auto w-full' />
            </MacCard>

            <div className='absolute -right-8 -bottom-16 z-30 w-72 overflow-hidden rounded-xl bg-white shadow-xl'>
              <div className='relative h-40 overflow-hidden bg-gradient-to-br from-blue-900 to-blue-600'>
                <img src='/HomeFiles/learning.png' alt='City skyline at night' className='h-full w-full object-cover' />
              </div>

              <div className='bg-white p-4'>
                <div className='flex items-center space-x-3'>
                  <div className='h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-white shadow-lg'>
                    <img src='/images/Rosie.jpg' alt='Wanda Gordon' className='h-full w-full object-cover' />
                  </div>
                  <div className='flex-1'>
                    <h4 className='text-lg font-semibold text-gray-900'>Rosie BlackPink</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`transition-all delay-400 duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
          >
            <div className='mb-2 text-sm font-semibold text-blue-600'>NO LIMITS</div>
            <h3 className='mb-6 text-4xl font-bold text-gray-900'>
              Excellent <span className='text-sky-600'>STEM</span>
              <br />
              Learning Process
            </h3>
            <p className='mb-4 text-gray-600'>
              An engaging, hands-on approach to teaching STEM/STEAM, coding, and other subjects.
            </p>
            <p className='text-gray-600'>
              Activities and Lessons in STEMify Classroom can help you create a culture of self-driven students and
              project-based learning, where students of all backgrounds and skill levels can work together and thrive.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
