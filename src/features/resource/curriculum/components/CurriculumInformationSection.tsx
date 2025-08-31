import { Button } from '@/components/shadcn/button'
import { School, SquarePen, Trash2 } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { CurriculumStatus } from '../types/curriculum.type'
import { Badge } from '@/components/shadcn/badge'
import { useTranslations } from 'next-intl'
type Props = {
  onEdit: () => void
}
export default function CurriculumInformationSection({ onEdit }: Props) {
  const t = useTranslations('Curriculum')
  const handleDelete = () => {
    // Handle delete action
  }
  const handleUpdateCurriculumStatus = (status: CurriculumStatus) => {}

  return (
    <div className='grid grid-cols-1 gap-12 py-5 md:grid-cols-3'>
      {/* Content Section */}
      <div className='flex flex-col md:col-span-2'>
        <h2 className='mb-2 text-sm text-gray-500 uppercase'>STEM_STRAW_K1</h2>
        <div className='flex items-center gap-2'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900'>STEM Starter Curriculum</h1>
          <span className='cursor-pointer text-blue-500'>
            <SquarePen onClick={onEdit} />
          </span>
          <span className='cursor-pointer text-red-500'>
            <Trash2 onClick={handleDelete} />
          </span>
        </div>

        <div className='mb-6 h-1 w-20 bg-yellow-500' />

        {/* badges */}
        <div className='mb-4 flex flex-wrap gap-2'>
          <Badge className='bg-blue-100 text-blue-800'>PUBLISHED</Badge>
          <Badge className='bg-amber-100 text-amber-800'>Ages 9-10</Badge>
        </div>

        <p className='mb-4 text-lg text-gray-700'>
          This is an introductory toolbox designed for educators in learning environments and young makers at home who
          are looking for a STEM solution.
        </p>
        <p className='mb-6 text-lg text-gray-700'>
          This kit is a great introduction to the world of STEM education and offers a fun and engaging way to learn
          about science, technology, engineering, art, and math.
        </p>

        {/* Review actions */}
        {/* {(curriculum.data.status === CurriculumStatus.PENDING || curriculum.data.status === CurriculumStatus.DRAFT) && ( */}
        <div className='flex gap-3'>
          <Button
            className='cursor-pointer bg-green-600 font-semibold text-white shadow'
            onClick={() => handleUpdateCurriculumStatus(CurriculumStatus.PUBLISHED)}
          >
            {t('approve')}
          </Button>
          <Button
            className='cursor-pointer border border-red-600 bg-white font-semibold text-red-600 shadow'
            onClick={() => handleUpdateCurriculumStatus(CurriculumStatus.REJECTED)}
          >
            {t('reject')}
          </Button>
        </div>
        {/* )} */}
      </div>
      {/* Image Section */}
      <div className='relative max-h-[400px] max-w-[400px] overflow-hidden rounded-2xl shadow-md'>
        <Image
          src='https://6234779.fs1.hubspotusercontent-na1.net/hub/6234779/hubfs/product_imagination-kit_02.jpg?width=1920&name=product_imagination-kit_02.jpg'
          alt='STEM Starter Curriculum'
          width={400}
          height={400}
          className='h-full w-full object-cover'
        />
      </div>
    </div>
  )
}
