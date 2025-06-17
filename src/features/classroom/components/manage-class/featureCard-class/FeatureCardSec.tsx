import { motion, useInView } from 'framer-motion'
import React, { useRef } from 'react'
import { Video, Users } from 'lucide-react'
import { fadeInUp, staggerContainer } from '@/utils/motion'

export default function FeatureCardSec() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const features = [
    {
      icon: Video,
      title: 'Get Started with Video',
      description: 'Quality video lectures can set your classroom apart. Use our resources to learn the basics.',
      illustration: 'bg-gradient-to-br from-purple-100 to-blue-100'
    },
    {
      icon: Users,
      title: 'Build Your Audience',
      description: 'Set your classroom up for success by building your target audience.',
      illustration: 'bg-gradient-to-br from-green-100 to-teal-100'
    }
  ]

  return (
    <motion.section
      ref={ref}
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      className='mx-auto max-w-7xl px-6 py-8'
    >
      <div className='grid gap-6 md:grid-cols-2'>
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'
          >
            <div className='flex items-start gap-6'>
              <div
                className={`h-24 w-24 ${feature.illustration} flex flex-shrink-0 items-center justify-center rounded-lg`}
              >
                <feature.icon className='h-8 w-8 text-amber-400' />
              </div>
              <div className='flex-1'>
                <h3 className='mb-3 text-xl font-semibold text-gray-900'>{feature.title}</h3>
                <p className='mb-4 text-gray-600'>{feature.description}</p>
                <button className='font-medium text-amber-400 underline transition-colors hover:text-amber-500'>
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
