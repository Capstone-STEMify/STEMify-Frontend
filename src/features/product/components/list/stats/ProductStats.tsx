import React from 'react'
import { motion } from 'framer-motion'

const StatsSection: React.FC = () => {
  const stats = [
    { label: 'Happy Customers', value: '50K+' },
    { label: 'Products', value: '2K+' },
    { label: 'Reviews', value: '4.9★' },
    { label: 'Countries', value: '30+' }
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className='mb-16 rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 p-12'
    >
      <div className='grid grid-cols-2 gap-8 md:grid-cols-4'>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className='text-center'
          >
            <div className='mb-2 text-4xl font-bold text-white md:text-5xl'>{stat.value}</div>
            <div className='text-sm text-gray-400 md:text-base'>{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

export default StatsSection
