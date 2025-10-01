import React from 'react'
import { motion } from 'framer-motion'

const SoftwareSupport: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className='relative mx-auto max-w-7xl overflow-hidden rounded-3xl p-10'
    >
      <h2 className='mb-12 text-center text-4xl font-semibold text-gray-900'>Take your STEM Class to the Next Level</h2>
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
              src='https://cdn.shopify.com/s/files/1/0070/5901/3716/files/Gamified_Coding.jpg?v=1731390857&width=2048'
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
              src='https://cdn.shopify.com/s/files/1/0070/5901/3716/files/Fun-filled_Playing_0d96b89c-2c97-467c-85ed-f0d947faec8c.jpg?v=1731390857&width=2048'
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
              src='https://cdn.shopify.com/s/files/1/0070/5901/3716/files/Easy_Building.jpg?v=1731390864&width=2048'
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
