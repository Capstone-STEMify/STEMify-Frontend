import { motion } from 'framer-motion'
import ResourceCard from '@/components/shared/card/ResourceCard'
import { fadeInUp } from '@/utils/motion'

export default function ContentSection() {
  // Sample lesson cards data
  const lessons = [
    {
      title: 'Plants and Animals',
      description: 'Connect with the natural world and learn about the plants and animals that live within.',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
      category: 'ACTIVITY',
      age: '4-14+',
      duration: '30:00'
    },
    {
      title: 'Health and Safety',
      description:
        'Practice safety skills when it comes to the road and take care of your growing body to become independent.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      category: 'ACTIVITY',
      age: '4-14+',
      duration: '30:00'
    },
    {
      title: 'Using Tools',
      description: "Let's look at home for the tools we use in our everyday lives.",
      image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop',
      category: 'ACTIVITY',
      age: '4-14+',
      duration: '30:00'
    },
    {
      title: 'Transportation',
      description: 'Explore and compare the different types of transportation methods.',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
      category: 'ACTIVITY',
      age: '4-14+',
      duration: '30:00'
    },
    {
      title: 'My Culture',
      description: 'Create symbolic cultural works of art.',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
      category: 'ACTIVITY',
      age: '4-14+',
      duration: '30:00'
    },
    {
      title: 'Our World',
      description: 'About the world, the people, and cultures that make it diverse.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      category: 'ACTIVITY',
      age: '4-14+',
      duration: '30:00'
    }
  ]

  return (
    <motion.section
      id='courses'
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true }}
      variants={fadeInUp}
      className='bg-white py-12 md:py-16'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <h2 className='mb-8 text-center text-2xl font-bold text-gray-900 sm:text-3xl md:text-left'>Course Content</h2>

        <div className='mb-8 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-gray-600 md:justify-start'>
          <span>📚 6 activities</span>
          <span>🎯 Interactive lessons</span>
          <span>⏱️ 3 hours total</span>
        </div>

        {/* Lesson Cards Section */}
        <div className='w-full'>
          <div className='max-h-[800px] overflow-y-auto p-5'>
            <div className='grid grid-cols-1 gap-6 pr-2 md:grid-cols-2 lg:grid-cols-3'>
              {lessons.map((lesson, index) => (
                <ResourceCard key={index} resource={lesson} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
