'use client'
import { SCarousel } from '@/components/shared/SCarousel'
import Image from 'next/image'

type KitInformationSectionProps = {
  kitIds: number[] | undefined
}

export default function KitInformationSection({ kitIds }: KitInformationSectionProps) {
  return (
    <div className='space-y-10 py-10'>
      <div className='text-center'>
        <h1 className='text-5xl'>Stemify Kit Included</h1>
        <hr className='mx-auto my-6 w-1/4 border-2 border-amber-400' />
        <p className='mx-auto w-180 py-5'>
          You will have access to a full range of lessons, activities and explorations as well as different ways to
          navigate through it, highlighting different learning strategies and expected outcomes you can directly
          distribute to students via Strawbees Classroom.
        </p>
      </div>
      <section className='flex flex-col justify-between gap-20 md:flex-row'>
        {/* Left Section */}
        <div className='max-w-2xl'>
          <h2 className='mb-4 text-4xl font-bold tracking-tight'>Stemify Classroom Kit</h2>
          <p className='mb-4 leading-relaxed text-gray-700'>
            Use a STEAM Starter Kit for a single or a pair of students at a time. We recommend pairing students together
            when creating any project made from a lesson or activity resource in the Classroom.
          </p>
          <p className='leading-relaxed text-gray-700'>
            Use it as a personal teacher demo kit for building projects along with your students. This kit is also an
            excellent size for following along in Strawbees professional development sessions.
          </p>
        </div>

        {/* Right Section */}
        <SCarousel
          variant='plugin'
          autoplayDelay={2000}
          items={Array.from({ length: 5 }).map((_, i) => (
            <div className='p-1' key={i}>
              <Image
                src='https://6234779.fs1.hubspotusercontent-na1.net/hub/6234779/hubfs/product_imagination-kit_02.jpg?width=1920&name=product_imagination-kit_02.jpg'
                alt='Imagination Kit'
                width={800}
                height={800}
                className='w-full max-w-xl rounded-3xl object-cover shadow-xs'
              />
            </div>
          ))}
        />
      </section>
    </div>
  )
}
