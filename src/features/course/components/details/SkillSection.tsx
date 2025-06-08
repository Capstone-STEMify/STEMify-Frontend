import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

export default function SkillSection() {
  const outcomes = [
    {
      title: 'Ways to create and describe a game concept',
      items: [
        'Ways to create and describe a game concept',
        'Ways to create and describe a game concept',
        'Ways to create and describe a game concept'
      ]
    },
    {
      title: 'Concepts and approaches involved in creating successful character designs',
      items: [
        'Concepts and approaches involved in creating successful character designs',
        'Concepts and approaches involved in creating successful character designs',
        'Concepts and approaches involved in creating successful character designs'
      ]
    },
    {
      title: 'Evaluation and interpretation of different story styles',
      items: [
        'Evaluation and interpretation of different story styles',
        'Evaluation and interpretation of different story styles',
        'Evaluation and interpretation of different story styles'
      ]
    }
  ]

  return (
    <motion.section
      id='skill'
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true }}
      variants={staggerContainer}
      className='bg-gray-50 py-16'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <motion.h2 variants={staggerItem} className='mb-12 text-center text-3xl font-bold text-gray-900'>
          Skills learned from the course
        </motion.h2>

        <div className='grid gap-8 md:grid-cols-3'>
          {outcomes.map((outcome, index) => (
            <motion.div key={index} variants={staggerItem} className='space-y-4'>
              {outcome.items.map((item, itemIndex) => (
                <div key={itemIndex} className='flex items-start rounded-lg bg-white p-4 shadow-sm'>
                  <CheckCircle className='mt-1 mr-3 h-5 w-5 flex-shrink-0 text-green-500' />
                  <span className='text-sm text-gray-700'>{item}</span>
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
