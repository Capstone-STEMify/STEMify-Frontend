'use client'
import { Button } from '@/components/shadcn/button'
import SearchBar from '@/components/shared/search/SearchBar'
import SSelect from '@/components/shared/SSelect'
import ClassroomCard from '@/features/classroom/components/classroom-list/ClassroomCard'
import ClassroomHero from '@/features/classroom/components/classroom-list/ClassroomHero'
import { BookOpen, Plus } from 'lucide-react'
import React, { useRef, useState } from 'react'
import ClassRoomManagement from './manage-class/ClassRoomManagement'
import { motion, useInView } from 'framer-motion'

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const classroomData = [
  {
    name: 'STEM Robotics Class',
    image: '/images/stemclass.jpg',
    member: 24,
    avatar: ['https://github.com/shadcn.png', 'https://github.com/leerob.png', 'https://github.com/evilrabbit.png']
  },
  {
    name: 'STEM Robotics Class',
    image: '/images/stemclass.jpg',
    member: 24,
    avatar: ['https://github.com/shadcn.png', 'https://github.com/leerob.png', 'https://github.com/evilrabbit.png']
  },
  {
    name: 'STEM Robotics Class',
    image: '/images/stemclass.jpg',
    member: 24,
    avatar: ['https://github.com/shadcn.png', 'https://github.com/leerob.png', 'https://github.com/evilrabbit.png']
  },
  {
    name: 'STEM Robotics Class',
    image: '/images/stemclass.jpg',
    member: 24,
    avatar: ['https://github.com/shadcn.png', 'https://github.com/leerob.png', 'https://github.com/evilrabbit.png']
  },
  {
    name: 'STEM Robotics Class',
    image: '/images/stemclass.jpg',
    member: 24,
    avatar: ['https://github.com/shadcn.png', 'https://github.com/leerob.png', 'https://github.com/evilrabbit.png']
  },
  {
    name: 'STEM Robotics Class',
    image: '/images/stemclass.jpg',
    member: 24,
    avatar: ['https://github.com/shadcn.png', 'https://github.com/leerob.png', 'https://github.com/evilrabbit.png']
  },
  {
    name: 'STEM Robotics Class',
    image: '/images/stemclass.jpg',
    member: 24,
    avatar: ['https://github.com/shadcn.png', 'https://github.com/leerob.png', 'https://github.com/evilrabbit.png']
  },
  {
    name: 'STEM Robotics Class',
    image: '/images/stemclass.jpg',
    member: 24,
    avatar: ['https://github.com/shadcn.png', 'https://github.com/leerob.png', 'https://github.com/evilrabbit.png']
  }
]

export default function ClassroomList() {
  const [searchQuery, setSearchQuery] = useState('')
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const filteredData = classroomData.filter((classroom) => {
    const matchesSearch = classroom.name.toLowerCase().includes(searchQuery.toLowerCase())
    // const matchesFilter = selectedFilter === 'all' || classroom.subject.toLowerCase() === selectedFilter.toLowerCase()
    // return matchesSearch && matchesFilter
    return matchesSearch
  })

  const handleSearch = () => {}
  return (
    <div className=' pb-30 min-h-screen'>
      <ClassroomHero />

      <ClassRoomManagement/>

      {/* Classroom list */}
      <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className='max-w-7xl mx-auto mt-8'>
        <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <SearchBar />
          <div className='flex items-center justify-between gap-4 sm:justify-start'>
            <SSelect
              items={[
                { value: 'all', content: 'All' },
                { value: 'recently', content: 'Recently' }
              ]}
              placeholder='Filter by subject'
              value='all'
              onChange={(value) => console.log(value)}
            />
            <Button size={'icon'} className='bg-amber-custom-400 rounded-full font-bold'>
              <Plus />
            </Button>
          </div>
        </div>
        <div className='grid grid-cols-1 justify-items-center space-y-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3'>
          {/* Replace with filter later */}
          {/* {filteredData.map((classroom, index) => ( */}
          {classroomData.map((classroom, index) => (
            <ClassroomCard
              key={index}
              classroom={{
                name: classroom.name,
                image: classroom.image,
                member: classroom.member,
                avatar: classroom.avatar
              }}
              size='lg'
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className='py-12 text-center'>
            <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-200'>
              <BookOpen className='h-8 w-8 text-gray-400' />
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>No classrooms found</h3>
            <p className='text-gray-500'>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </motion.section>
    </div>
  )
}
