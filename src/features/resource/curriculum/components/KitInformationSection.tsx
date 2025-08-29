'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import STabs from '@/components/shared/STabs'
import { ImageTabsSection } from './ImageTabsSection'

const contentData = [
  {
    id: 1,
    name: 'Check our Imagination Kit!',
    description:
      'Use a STEAM Starter Kit for a single or a pair of students at a time. We recommend pairing students together when creating any project made from a lesson or activity resource in the Classroom.',
    imageUrl: '/images/imagination-kit.png'
  },
  {
    id: 2,
    name: 'Explore Add-ons',
    description:
      'Enhance your building experience with our exciting add-ons. These add-ons provide more connectors, straws, and sensors to expand creative possibilities.',
    imageUrl: '/images/addons-kit.png'
  }
]

type KitInformationSectionProps = {
  kitIds: number[] | undefined
}

export default function KitInformationSection({ kitIds }: KitInformationSectionProps) {
  return (
    <div className='space-y-10'>
      <div className='text-center'>
        <h1 className='text-3xl'>Stemify Kids</h1>
        <p className='mx-auto w-180 py-5'>
          You will have access to a full range of lessons, activities and explorations as well as different ways to
          navigate through it, highlighting different learning strategies and expected outcomes you can directly
          distribute to students via Strawbees Classroom.
        </p>
      </div>
      <ImageTabsSection
        defaultValue='kit'
        items={[
          {
            value: 'kit',
            label: 'Imagination Kit',
            content: (
              <>
                <h2 className='text-3xl font-bold'>Check our Imagination Kit!</h2>
                <p className='text-muted-foreground'>
                  Use a STEAM Starter Kit for a single or a pair of students at a time. We recommend pairing students
                  together...
                </p>
                <p className='text-muted-foreground'>Use it as a personal teacher demo kit for building projects...</p>
                <button className='mt-4 rounded-md bg-yellow-400 px-6 py-2 font-semibold text-black transition hover:bg-yellow-500'>
                  SHOP NOW
                </button>
              </>
            ),
            image: {
              src: '/images/fallback.png',
              alt: 'Imagination Kit'
            }
          },
          {
            value: 'addons',
            label: 'Add-ons',
            content: (
              <>
                <h2 className='text-3xl font-bold'>Add-ons Included</h2>
                <p className='text-muted-foreground'>
                  Customize your kit with creative parts like Duck Feet with magnets, Eyes with stickers, and more...
                </p>
                <button className='mt-4 rounded-md bg-yellow-400 px-6 py-2 font-semibold text-black transition hover:bg-yellow-500'>
                  SHOP NOW
                </button>
              </>
            ),
            image: {
              src: '/images/fallback.png',
              alt: 'Add-ons'
            }
          }
        ]}
      />
    </div>
  )
}
