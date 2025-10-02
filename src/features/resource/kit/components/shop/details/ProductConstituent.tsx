import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Component } from '@/features/resource/kit/types/kit.type'

export type WhatsIncludedProps = {
  components: Component[]
  name?: string
  addBtn?: React.ReactNode
}
const WhatsIncluded: React.FC<WhatsIncludedProps> = ({ components, name, addBtn }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className='rounded-3xl bg-white p-10 shadow-xl'
    >
      <div className='mb-8 flex cursor-pointer items-center justify-between'>
        <div className='flex items-center gap-4'>
          <h2 className='text-4xl font-semibold text-gray-900'>What's Included</h2>
          {addBtn && <div>{addBtn}</div>}
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className='h-8 w-8 text-gray-600' onClick={() => setIsExpanded(!isExpanded)} />
        </motion.div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className='overflow-hidden'
      >
        <div className='mb-6 border-b border-gray-200 pb-6'>
          {name && <h3 className='text-2xl font-semibold text-gray-900'>{name}</h3>}
        </div>

        <div className='grid grid-cols-4 gap-4 md:grid-cols-6 lg:grid-cols-8'>
          {components.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className='flex flex-col items-center'
            >
              <div className='mb-2 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-gray-50 p-2'>
                <img src={item.imageUrl} alt={item.name} className='h-full w-full object-contain' />
              </div>
              <h4 className='mb-1 text-center text-sm leading-tight font-medium text-gray-900'>{item.name}</h4>
              <p className='text-xs text-gray-500'>x{item.quantity}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default WhatsIncluded
