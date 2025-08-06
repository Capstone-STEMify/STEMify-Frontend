'use client'
import MacCard from '@/components/shared/card/MacCard'
import Image from 'next/image'
import React, { useState } from 'react'

export default function ToolsSection() {
  const tools = [
    { icon: '/HomeFiles/tools/classroom.jpg' },
    { icon: '/HomeFiles/tools/drive.png' },
    { icon: '/HomeFiles/tools/camera.jpg' },
    { icon: '/HomeFiles/tools/facebook.png' },
    { icon: '/HomeFiles/tools/zalo.png' },
    { icon: '/HomeFiles/tools/calendar.png' },
    { icon: '/HomeFiles/tools/paint.png' },
    { icon: '/HomeFiles/tools/note.jpg' }
  ]

  return (
    <section className='relative overflow-hidden bg-gray-50 px-6 py-16'>
      {/* Background floating elements */}
      <div className='animate-float absolute top-10 left-10 h-20 w-20 rounded-full bg-blue-300 opacity-20'></div>
      <div className='animate-float-delayed absolute right-20 bottom-20 h-16 w-16 rounded-full bg-orange-300 opacity-30'></div>
      <div className='absolute top-1/3 right-1/4 h-12 w-12 animate-pulse rounded-full bg-yellow-300 opacity-25'></div>

      <div className='relative z-10 mb-12 text-center'>
        <h1 className='mb-4 text-5xl font-bold text-gray-900'>What is STEMify?</h1>
        <p className='mx-auto max-w-2xl text-gray-600'>
          In this video, discover how STEMify addresses the gap in 21st-century skills education with hands-on STEAM and
          STEM solutions. We support teachers to build the innovators of tomorrow by fostering creativity, coding, and
          rapid prototyping. With accessible tools and free digital and offline resources, students of all abilities can
          explore and develop essential skills for the future.
        </p>
      </div>

      <div className='relative mx-auto max-w-5xl'>
        <div className='relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-200 via-blue-200 to-pink-200 p-8 shadow-xl'>
          <div className='animate-slow-spin absolute top-0 -left-16 h-full w-32 rounded-full bg-gradient-to-b from-yellow-400 to-orange-400 opacity-80'></div>
          <div className='animate-slow-spin-reverse absolute top-0 -right-16 h-full w-32 rounded-full bg-gradient-to-b from-blue-400 to-cyan-400 opacity-80'></div>

          <div className='relative z-20 mb-8 flex justify-center'>
            <MacCard>
              <video autoPlay loop muted playsInline className='h-full w-full object-cover'>
                <source src='https://res.cloudinary.com/dtjgueyp2/video/upload/intro_jmad2e.mp4' type='video/mp4' />
              </video>
            </MacCard>
            <div className='absolute -top-2 -left-2 -z-10 h-full w-full rounded-lg bg-gradient-to-br from-yellow-300 to-orange-300 opacity-30'></div>
          </div>

          <div className='relative z-10 grid grid-cols-4 justify-items-center gap-4 md:grid-cols-8'>
            {tools.map((tool, index) => (
              <div
                key={index}
                className={`flex h-12 w-12 animate-bounce items-center justify-center rounded-lg bg-white transition-transform duration-300 hover:scale-110`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className='font-bold text-white'>
                  <Image width={30} height={30} alt='' src={tool.icon} />
                </span>
              </div>
            ))}
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
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes slow-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes slow-spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-slow-spin {
          animation: slow-spin 20s linear infinite;
        }
        .animate-slow-spin-reverse {
          animation: slow-spin-reverse 25s linear infinite;
        }
      `}</style>
    </section>
  )
}
