import { Button } from '@/components/shadcn/button'
import { SquarePen, Trash2 } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Badge } from '@/components/shadcn/badge'
import { useLocale, useTranslations } from 'next-intl'
import {
  useDeleteCurriculumMutation,
  useGetCurriculumByIdQuery,
  useUpdateCurriculumMutation
} from '@/features/resource/curriculum/api/curriculumApi'
import { useParams } from 'next/navigation'
import { Curriculum, CurriculumStatus } from '../../types/curriculum.type'
import { useModal } from '@/providers/ModalProvider'
import { toast } from 'sonner'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { useAppSelector } from '@/hooks/redux-hooks'
import { UserRole } from '@/types/userRole'
import { formatDate, useStatusTranslation } from '@/utils/index'

type OrganizationCurriculumInfoSectionProps = {
  curriculum: Curriculum
}

export default function OrganizationCurriculumInfoSection({ curriculum }: OrganizationCurriculumInfoSectionProps) {
  // Translations
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const t = useTranslations('curriculum')
  const to = useTranslations('organization.curriculum')

  const statusTranslate = useStatusTranslation()
  const locale = useLocale()

  return (
    <div className='grid grid-cols-1 gap-12 py-5 md:grid-cols-3'>
      {/* Content Section */}
      <div className='flex flex-col md:col-span-2'>
        <h2 className='mb-2 text-sm text-gray-500 uppercase'>{curriculum.code}</h2>
        <div className='flex items-center gap-2'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900'>{curriculum.title}</h1>
          <Badge className={getStatusBadgeClass(curriculum.status)}>{statusTranslate(curriculum.status)}</Badge>
        </div>

        {/* badges */}
        <div className='mb-4 flex flex-wrap gap-2'>
          <div className='flex items-center gap-2 text-sm'>
            <span className='text-gray-600'>{to('startDate')}:</span>
            <span className='font-medium text-gray-900'>
              {curriculum.startDate ? formatDate(curriculum.startDate, { locale }) : '-'}
            </span>
          </div>

          <div className='flex items-center gap-2 text-sm'>
            <span className='text-gray-600'>{to('endDate')}:</span>
            <span className='font-medium text-gray-900'>
              {curriculum.endDate ? formatDate(curriculum.endDate, { locale }) : '-'}
            </span>
          </div>
        </div>

        <div className='mb-6 h-1 w-20 bg-yellow-500' />

        <p className='mb-4 text-gray-700'>{curriculum.description}</p>
      </div>

      {/* Image Section */}
      <div>
        <div className='relative aspect-[4/4] w-full overflow-hidden rounded-2xl shadow-md'>
          <Image
            src={curriculum.imageUrl || '/images/fallback.png'}
            alt='STEAM Starter Curriculum'
            fill
            className='object-cover'
          />
        </div>
      </div>
    </div>
  )
}
