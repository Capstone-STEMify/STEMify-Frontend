'use client'
import MacCard from '@/components/shared/card/MacCard'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useState } from 'react'

export default function ToolsSection() {
  const t = useTranslations('ToolsSection')
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
  const [loading, setLoading] = useState(true)

  return (
    <section className='relative overflow-hidden bg-gray-50 px-6 py-16'>
      {/* Background floating elements */}
      <div className='animate-float absolute top-10 left-10 h-20 w-20 rounded-full bg-blue-300 opacity-20'></div>
      <div className='animate-float-delayed absolute right-20 bottom-20 h-16 w-16 rounded-full bg-orange-300 opacity-30'></div>
      <div className='absolute top-1/3 right-1/4 h-12 w-12 animate-pulse rounded-full bg-yellow-300 opacity-25'></div>

      <div className='relative z-10 mb-12 text-center'>
        <h1 className='mb-4 text-5xl font-bold text-gray-900'>{t('title')}</h1>
        <p className='mx-auto max-w-4xl text-lg text-gray-600'>{t('description')}</p>
      </div>

      <div className='relative mx-auto max-w-5xl'>
        <div className='relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-200 via-blue-200 to-pink-200 p-8 shadow-xl'>
          <div className='animate-slow-spin absolute top-0 -left-16 h-full w-32 rounded-full bg-gradient-to-b from-yellow-400 to-orange-400 opacity-80'></div>
          <div className='animate-slow-spin-reverse absolute top-0 -right-16 h-full w-32 rounded-full bg-gradient-to-b from-blue-400 to-cyan-400 opacity-80'></div>

          <div className='relative z-20 mb-8 flex justify-center'>
            <MacCard>
              <div className='relative h-full w-full'>
                {loading && (
                  <div className='absolute inset-0 z-10 flex items-center justify-center bg-black/20'>
                    <div className='h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent'></div>
                  </div>
                )}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload='auto'
                  className='h-full w-full object-cover'
                  onLoadedData={() => setLoading(false)}
                  onCanPlay={() => setLoading(false)}
                  onPlaying={() => setLoading(false)}
                  onWaiting={() => setLoading(true)}
                >
                  <source
                    src='https://res.cloudinary.com/dgdi9wvpz/video/upload/f_auto,q_auto/Main_2_mc5d1w.mp4'
                    type='video/mp4'
                  />
                </video>
              </div>
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
