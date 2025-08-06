'use client'
import React from 'react'

export default function StatsSection() {
  const stats = [
    { number: '195+', label: 'Free Resources', color: 'yellow' },
    { number: '1000+', label: 'Engaged Students', color: 'blue' },
    { number: '90%', label: 'Positive Impact on STEM', color: 'green' }
  ]

  return (
    <section className='relative overflow-hidden bg-gray-50 px-6 py-16'>
      <div className='animate-float absolute top-0 left-0 h-32 w-32 rounded-full bg-gradient-to-br from-yellow-300 to-orange-300 opacity-15'></div>
      <div className='animate-float-delayed absolute right-0 bottom-0 h-40 w-40 rounded-full bg-gradient-to-tl from-blue-300 to-cyan-300 opacity-20'></div>
      <div className='absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 transform animate-ping rounded-full bg-orange-400 opacity-30'></div>

      <div className='relative z-10 mx-auto grid max-w-4xl gap-8 text-center md:grid-cols-3'>
        {stats.map((stat, index) => (
          <div key={index} className='group relative'>
            <div
              className={`absolute -top-2 -left-2 h-full w-full bg-gradient-to-br from-${stat.color}-200 to-${stat.color === 'green' ? 'yellow' : stat.color}-200 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-30`}
            ></div>
            <div className='relative rounded-lg bg-white p-6 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:transform'>
              <div className='relative mb-2 text-4xl font-bold text-yellow-500'>
                {stat.number}
                <div
                  className={`absolute -top-1 -right-1 h-3 w-3 bg-${stat.color}-400 animate-pulse rounded-full opacity-60`}
                ></div>
              </div>
              <div className='font-semibold text-gray-700'>{stat.label}</div>
            </div>
          </div>
        ))}
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
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
