import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

const SoftwareSupport: React.FC = () => {
  const t = useTranslations('kits')
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className='relative mx-auto max-w-7xl overflow-hidden rounded-3xl p-10'
    >
      <h2 className='mb-12 text-center text-4xl font-semibold text-gray-900'>{t('detail.headlineStem')}</h2>
      <div className='relative z-10 grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div className='relative overflow-hidden rounded-3xl px-4 py-8 md:row-span-2'>
          <motion.div
            className='relative h-fit transform overflow-hidden rounded-2xl transition-transform duration-300'
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <motion.img
              src='https://stemfinity.com/cdn/shop/products/6_Maker_Kit_Strawbees_description1.jpg?v=1680691949&width=1080'
              alt='Gamified Coding Interface'
              className='h-auto w-full object-cover'
              whileHover={{ scale: 1.05 }}
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className='absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold text-blue-500 shadow-lg transition-colors duration-300 hover:bg-blue-500 hover:text-white'
          >
            +
          </motion.button>
        </div>

        <div className='relative overflow-hidden rounded-3xl p-4'>
          <motion.div
            className='relative transform overflow-hidden rounded-2xl transition-transform duration-300'
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <motion.img
              src='https://strawbees.com/hs-fs/hubfs/LP_project.jpg?width=1920&height=1080&name=LP_project.jpg'
              alt='Fun-filled Playing Interface'
              className='h-auto w-full object-cover'
              whileHover={{ scale: 1.05 }}
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className='absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold text-blue-500 shadow-lg transition-colors duration-300 hover:bg-blue-500 hover:text-white'
          >
            +
          </motion.button>
        </div>

        <div className='relative overflow-hidden rounded-3xl p-4'>
          <motion.div
            className='relative transform overflow-hidden rounded-2xl transition-transform duration-300'
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <motion.img
              src='https://d3t0tbmlie281e.cloudfront.net/igi/browndoggadgets/R1XlRBKJMxKhYn1G.full'
              alt='Easy Building Interface'
              className='h-auto w-full object-cover'
              whileHover={{ scale: 1.05 }}
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className='absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold text-blue-500 shadow-lg transition-colors duration-300 hover:bg-blue-500 hover:text-white'
          >
            +
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default SoftwareSupport
