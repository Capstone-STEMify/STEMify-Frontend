import MacCard from '@/components/shared/card/MacCard'
import React, { useEffect, useState } from 'react'
import MacCardVideo from '../landing/MacCardVideo'

export default function ToolSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentSlide] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    const element = document.getElementById('tools-section')
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const slides = [
    {
      title: 'Easily create classes',
      features: ['Create a class', 'Invite students to join', 'Share a class code to add students.'],
      image: 'tablet'
    },
    {
      title: 'Monitor Progress',
      features: ['Track student activity', 'View completed assignments', 'Generate progress reports'],
      image: 'progress'
    },
    {
      title: 'Assign Activities',
      features: ['Create custom assignments', 'Set due dates', 'Provide feedback'],
      image: 'activities'
    }
  ]

  return (
    <section id='tools-section' className='bg-white py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div
          className={`mb-16 text-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <h2 className='mb-4 text-4xl font-bold text-amber-400 md:text-5xl'>Classroom Tools</h2>
        </div>

        <div className='relative'>
          <div className='grid grid-cols-1 items-center lg:grid-cols-2'>
            <div
              className={`transition-all delay-200 duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
            >
              <h3 className='mb-8 text-4xl font-bold text-gray-900'>{slides[currentSlide].title}</h3>
              <div className='mb-8 space-y-4'>
                {slides[currentSlide].features.map((feature, index) => (
                  <div key={index} className='flex items-center space-x-3'>
                    <div className='h-4 w-4 rounded-full bg-green-500'></div>
                    <span className='text-3xl text-gray-700'>{feature}</span>
                  </div>
                ))}
              </div>
              <button className='text-xl font-semibold text-blue-600 hover:text-blue-800'>
                Find more about the app →
              </button>
            </div>

            <div
              className={`relative transition-all delay-400 duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
            >
              <div className='absolute -top-15 -left-35 -z-10 h-80 w-80 rotate-12 transform'>
                <img src='/images/effectbg.png' alt='effect' />
              </div>

              <div className='relative z-10'>
                <MacCard>
                  <MacCardVideo />
                </MacCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
