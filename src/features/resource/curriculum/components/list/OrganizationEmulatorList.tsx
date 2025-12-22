import { EmulatorWithThumbnail } from '@/features/emulator/types/emulator.type'
import React from 'react'
import { Card, CardContent } from '@/components/shadcn/card'
import Image from 'next/image'
import SEmpty from '@/components/shared/empty/SEmpty'
type OrganizationEmulatorListProps = {
  emulations?: EmulatorWithThumbnail[]
}

export default function OrganizationEmulatorList({ emulations }: OrganizationEmulatorListProps) {
  const t = useTranslations('curriculum')

  return (
    <div>
      <div className='mb-3 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>
          {t('list.emulatorListTitle')}{' '}
          <span className='rounded bg-sky-200 px-2 text-sm text-gray-600'>{emulations?.length}</span>
        </h2>
      </div>

      {/* <DataTable data={rows} columns={filteredColumns as any} /> */}

      {emulations?.length === 0 && <SEmpty title={t('details.noEmulatorInCurriculum')} />}

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {emulations?.map((emulator) => (
          <Card
            key={emulator.emulationId}
            className='group cursor-pointer overflow-hidden border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-blue-200'
          >
            <CardContent className='p-0'>
              {/* Thumbnail */}
              <div className='relative aspect-[4/3] w-full overflow-hidden rounded-t-lg'>
                <Image
                  src={emulator.thumbnailUrl || '/images/shape.png'}
                  alt={emulator.name}
                  fill
                  className='object-cover transition-transform duration-300 group-hover:scale-105'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
                />
              </div>

              {/* Content */}
              <div className='p-4 text-center'>
                <h3 className='text-sm font-medium text-gray-800 transition-colors group-hover:text-blue-600'>
                  {emulator.name}
                </h3>
                <p className='mt-1 line-clamp-2 text-xs text-gray-500'>{emulator.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
