import { motion } from 'framer-motion'
import { fadeInUp } from '@/utils/motion'
import CardLayout from '@/components/shared/card/CardLayout'
import { Badge } from '@/components/shadcn/badge'
import { formatDuration } from '@/utils/index'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { BookOpen, Clock, Target } from 'lucide-react'
import { SPagination } from '@/components/shared/SPagination'

export default function ContentSection() {
  const lessons = [
    {
      title: 'Plants and Animals',
      description: 'Connect with the natural world and learn about the plants and animals that live within.',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
      category: 'Activity',
      age: '4-14+',
      duration: 30
    },
    {
      title: 'Health and Safety',
      description:
        'Practice safety skills when it comes to the road and take care of your growing body to become independent.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      category: 'Activity',
      age: '4-14+',
      duration: 30
    },
    {
      title: 'Using Tools',
      description: "Let's look at home for the tools we use in our everyday lives.",
      image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop',
      category: 'Activity',
      age: '4-14+',
      duration: 30
    },
    {
      title: 'Transportation',
      description: 'Explore and compare the different types of transportation methods.',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
      category: 'Activity',
      age: '4-14+',
      duration: 30
    },
    {
      title: 'My Culture',
      description: 'Create symbolic cultural works of art.',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
      category: 'Activity',
      age: '4-14+',
      duration: 30
    },
    {
      title: 'Our World',
      description: 'About the world, the people, and cultures that make it diverse.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      category: 'Activity',
      age: '4-14+',
      duration: 30
    }
  ]

  return (
    <motion.section
      id='lessons'
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true }}
      variants={fadeInUp}
      className='scroll-mt-24 bg-white py-12'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>Lesson Content</h2>
          <p className='mx-auto mb-8 max-w-2xl text-lg text-gray-600'>
            Engaging activities designed to inspire learning and growth
          </p>

          {/* Stats */}
          <div className='flex flex-wrap justify-center gap-6 text-sm'>
            <div className='flex items-center gap-2 text-gray-700'>
              <BookOpen className='h-4 w-4 text-blue-600' />
              <span className='font-medium'>6 activities</span>
            </div>
            <div className='flex items-center gap-2 text-gray-700'>
              <Target className='h-4 w-4 text-green-600' />
              <span className='font-medium'>Interactive lessons</span>
            </div>
            <div className='flex items-center gap-2 text-gray-700'>
              <Clock className='h-4 w-4 text-purple-600' />
              <span className='font-medium'>3 hours total</span>
            </div>
          </div>
        </div>

        {/* Lesson Cards Section */}
        {/* use pagination */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {lessons.map((lesson, index) => (
            <CardLayout
              key={index}
              imageSrc={lesson.image}
              infor={<Badge className='bg-skye-custom-600 p-1'>{lesson.category}</Badge>}
            >
              <div className='flex min-h-0 flex-1 flex-col'>
                <h3 className='text-lg font-semibold'>{lesson.title}</h3>
                <p className='text-sm text-gray-600'>{lesson.description}</p>
                {/* footer */}
                <div className='mt-auto flex items-center gap-2'>
                  <Badge className='bg-blue-100 text-blue-800'>{lesson.age}</Badge>
                  <Badge className='bg-green-100 text-green-800'>{formatDuration(lesson.duration)}</Badge>
                </div>
              </div>
            </CardLayout>
          ))}
        </div>
        <SPagination pageNumber={1} totalPages={5} onPageChanged={() => {}} className='mt-10' />
      </div>
    </motion.section>
  )
}
