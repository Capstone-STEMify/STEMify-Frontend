import { motion, useInView } from 'framer-motion'
import React, { useRef } from 'react'
import { MessageCircle, BookOpen, BarChart3, HeadphonesIcon, Play } from 'lucide-react'
import { fadeInUp, staggerContainer } from '@/utils/motion'

export default function ResourceSec() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const resources = [
    {
      icon: Play,
      title: 'Test Video',
      description: 'Send us a sample video and get expert feedback.',
      color: 'text-amber-400'
    },
    {
      icon: MessageCircle,
      title: 'Instructor Community',
      description: 'Connect with experienced instructors. Ask questions, browse discussions, and more.',
      color: 'text-amber-400'
    },
    {
      icon: BookOpen,
      title: 'Teaching Center',
      description: 'Learn about best practices for teaching on Udemy.',
      color: 'text-amber-400'
    },
    {
      icon: BarChart3,
      title: 'Marketplace Insights',
      description: 'Validate your classroom topic by exploring our marketplace supply and demand.',
      color: 'text-amber-400'
    },
    {
      icon: HeadphonesIcon,
      title: 'Help and Support',
      description: 'Browse our Help Center or contact our support team.',
      color: 'text-amber-400'
    }
  ]

  return (
    <motion.section
      ref={ref}
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      className='mx-auto max-w-7xl px-6 py-12'
    >
      <motion.div variants={fadeInUp} className='mb-12 text-center'>
        <p className='text-gray-600'>Have questions? Here are our most popular instructor resources.</p>
      </motion.div>

      <div className='mb-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5'>
        {resources.map((resource, index) => (
          <motion.div key={index} variants={fadeInUp} className='group cursor-pointer text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gray-50 transition-colors group-hover:bg-amber-50'>
              <resource.icon className={`h-8 w-8 ${resource.color}`} />
            </div>
            <h3 className='mb-2 font-semibold text-gray-900 transition-colors group-hover:text-amber-400'>
              {resource.title}
            </h3>
            <p className='text-sm text-gray-600'>{resource.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
