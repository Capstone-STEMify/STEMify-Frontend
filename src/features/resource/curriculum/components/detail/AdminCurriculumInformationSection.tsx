import { Button } from '@/components/shadcn/button'
import { SquarePen, Trash2 } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Badge } from '@/components/shadcn/badge'
import { useTranslations } from 'next-intl'
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

type AdminCurriculumInformationSectionProps = {
  curriculumId: number
  curriculum: Curriculum
}

export default function AdminCurriculumInformationSection({
  curriculumId,
  curriculum
}: AdminCurriculumInformationSectionProps) {
  // Translations
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const { openModal } = useModal()
  const [deleteCurriculum] = useDeleteCurriculumMutation()
  const [updateCurriculumStatus] = useUpdateCurriculumMutation()

  const handleDelete = async () => {
    await deleteCurriculum(Number(curriculumId)).unwrap()
    toast.success(`${tt('successMessage.delete', {title: curriculum.title || ''})}`)
  }

  const handleUpdateCurriculumStatus = async (status: CurriculumStatus) => {
    try {
      await updateCurriculumStatus({ id: curriculumId, body: { status } }).unwrap()
      toast.success(`${tt('successMessage.update')}`)
    } catch (error) {
      toast.error(tt('errorMessage'))
    }
  }

  return (
    <div className='grid grid-cols-1 gap-12 py-5 md:grid-cols-3'>
      {/* Content Section */}
      <div className='flex flex-col md:col-span-2'>
        <h2 className='mb-2 text-sm text-gray-500 uppercase'>{curriculum.code}</h2>
        <div className='flex items-center gap-2'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900'>{curriculum.title}</h1>
          <span className='cursor-pointer text-blue-500'>
            <SquarePen
              onClick={() => {
                openModal('upsertCurriculum', { curriculum: curriculum.id })
              }}
            />
          </span>
          <span className='cursor-pointer text-red-500'>
            <Trash2
              onClick={() => {
                openModal('confirm', {
                  message: `${tt('confirmMessage.delete', { title: curriculum.title || '' })}`,
                  onConfirm: () => handleDelete()
                })
              }}
            />
          </span>
        </div>

        <div className='mb-6 h-1 w-20 bg-yellow-500' />

        {/* badges */}
        <div className='mb-4 flex flex-wrap gap-2'>
          <Badge className={getStatusBadgeClass(curriculum.status)}>{curriculum.status}</Badge>
        </div>

        <p className='mb-4 text-lg text-gray-700'>{curriculum.description}</p>

        {/* Review actions */}
        {(curriculum.status === CurriculumStatus.PENDING || curriculum.status === CurriculumStatus.DRAFT) && (
          <div className='flex gap-3'>
            <Button
              className='cursor-pointer bg-green-600 font-semibold text-white shadow'
              onClick={() =>
                openModal('confirm', {
                  message: `${tt('confirmMessage.ask')}${curriculum.title} ${CurriculumStatus.PUBLISHED}?`,
                  onConfirm: () => handleUpdateCurriculumStatus(CurriculumStatus.PUBLISHED)
                })
              }
            >
              {tc('button.approve')}
            </Button>
            <Button
              className='cursor-pointer border border-red-600 bg-white font-semibold text-red-600 shadow'
              onClick={() =>
                openModal('confirm', {
                  message: `${tt('confirmMessage.ask')}${curriculum.title} ${CurriculumStatus.REJECTED}?`,
                  onConfirm: () => handleUpdateCurriculumStatus(CurriculumStatus.REJECTED)
                })
              }
            >
              {tc('button.reject')}
            </Button>
          </div>
        )}
      </div>
      {/* Image Section */}
      <div className='relative max-h-[400px] max-w-[400px] overflow-hidden rounded-2xl shadow-md'>
        <Image
          src={curriculum.imageUrl || '/images/fallback.png'}
          alt='STEAM Starter Curriculum'
          width={400}
          height={400}
          className='h-full w-full object-cover'
        />
      </div>
    </div>
  )
}
