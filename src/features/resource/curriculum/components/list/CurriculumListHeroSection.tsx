'use client'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function CurriculumListHeroSection() {
  const t = useTranslations('curriculum')

  return (
    <section
      className='relative mx-auto mb-10 w-full overflow-hidden bg-cover bg-center bg-no-repeat p-20 text-white'
      style={{
        backgroundImage: "url('https://classroom.strawbees.com/media/home_sechow.jpg')"
      }}
    >
      {/* Overlay đen mờ */}
      <div className='absolute inset-0 z-0 bg-black/60'></div>
      <div className='relative z-10 mx-auto max-w-6xl'>
        <div className='flex flex-col justify-between gap-16 md:flex-row md:items-center'>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className='flex-1'
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='mb-2 text-3xl font-bold md:text-6xl'
            >
              {t('list.heroTitle')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='my-4 max-w-4xl text-lg'
            >
              {t('list.heroDescription')}
            </motion.p>

            {/* Search Input */}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
