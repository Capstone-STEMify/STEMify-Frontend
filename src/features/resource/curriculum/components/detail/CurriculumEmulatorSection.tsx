'use client'
import CardLayout from '@/components/shared/card/CardLayout'
import { SCarousel } from '@/components/shared/SCarousel'
import { EmulatorWithThumbnail } from '@/features/emulator/types/emulator.type'
import { Course } from '@/features/resource/course/types/course.type'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React from 'react'

type CurriculumEmulatorSectionProps = {
  emulations: EmulatorWithThumbnail[]
}
export default function CurriculumEmulatorSection({ emulations }: CurriculumEmulatorSectionProps) {
  const t = useTranslations('curriculum')
  const router = useRouter()
  return (
    <div className='relative space-y-0 py-14 pb-20'>
      <div className='clip-slant relative h-[400px] bg-[#d8e9ff] py-16 text-center'>
        <h1 className='text-5xl'>{t('custom.emulatorListTitle')}</h1>
        <p className='mx-auto w-180 py-5'>{t('custom.emulatorListDescription')}</p>
      </div>

      <div className='relative z-10 mx-auto -mt-30 max-w-6xl'>
        <SCarousel
          variant='spacing'
          autoplayDelay={2000}
          items={emulations.map((emulation) => (
            <div className='group min-w-96 cursor-pointer p-2.5' key={emulation.emulationId}>
              <CardLayout
                imageRatio='aspect-3/2'
                imageClassName='object-cover transition-transform duration-300 group-hover:scale-110'
                onClick={() => router.push(`/lab/straw-lib/${emulation.emulationId}`)}
                imageSrc={emulation.thumbnailUrl ?? 'images/fallback.png'}
                className='rounded-3xl'
              >
                <div className='flex h-full flex-col justify-between p-2'>
                  <div className='mb-6 min-h-[130px]'>
                    <h4 className='text-amber-custom-400 text-sm font-semibold'>
                      {t('custom.courseTag').toLocaleUpperCase()}
                    </h4>
                    <p className='text-xl font-semibold text-gray-700'>{emulation.name}</p>
                    <p className='mt-3 line-clamp-3 text-sm text-gray-500'>{emulation.description || ''}</p>
                  </div>
                </div>
              </CardLayout>
            </div>
          ))}
        />
      </div>
    </div>
  )
}
