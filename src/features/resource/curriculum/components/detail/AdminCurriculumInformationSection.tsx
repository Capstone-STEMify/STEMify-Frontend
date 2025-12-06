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
import { useAppSelector } from '@/hooks/redux-hooks'
import { UserRole } from '@/types/userRole'
import { useStatusTranslation } from '@/utils/index'

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
  const t = useTranslations('curriculum')
  const statusTranslate = useStatusTranslation()
  const { openModal } = useModal()

  // Get current user
  const user = useAppSelector((state) => state?.auth?.user)

  // API hooks
  const [deleteCurriculum] = useDeleteCurriculumMutation()
  const [updateCurriculumStatus] = useUpdateCurriculumMutation()

  // handle actions
  const handleDelete = async () => {
    await deleteCurriculum(Number(curriculumId)).unwrap()
    toast.success(`${tt('successMessage.delete', { title: curriculum.title || '' })}`)
  }

  const handleUpdateCurriculumStatus = async (status: CurriculumStatus) => {
    try {
      await updateCurriculumStatus({ id: curriculumId, body: { status } }).unwrap()
      toast.success(`${tt('successMessage.action', { title: curriculum.title || '', action: status })}`)
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
                openModal('upsertCurriculum', { curriculumId: curriculum.id })
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

        {/* badges */}
        <div className='mb-4 flex flex-wrap gap-2'>
          <p className='text-sm text-gray-700 italic'>
            By <span className='font-semibold'>{curriculum.createdByUserName || 'STEMify'}</span>
          </p>
          <Badge className={getStatusBadgeClass(curriculum.status)}>{statusTranslate(curriculum.status)}</Badge>
        </div>

        <div className='mb-6 h-1 w-20 bg-yellow-500' />

        <p className='mb-4 text-gray-700'>{curriculum.description}</p>

        {/* Review actions (only for admin users) */}
        {/* {user && user.userRole === UserRole.ADMIN && curriculum.status === CurriculumStatus.PENDING && (
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
        )} */}
        {/* if admin user is the creator and curriculum is in draft status */}
        {user &&
          (user.userRole === UserRole.ADMIN || user.userRole === UserRole.STAFF) &&
          curriculum.status === CurriculumStatus.DRAFT &&
          curriculum.createdByUserId === user.userId && (
            <Button
              className='bg-sky-custom-600 w-30 cursor-pointer font-semibold text-white shadow'
              onClick={() =>
                openModal('confirm', {
                  message: `${tt('confirmMessage.ask')}${curriculum.title} ${CurriculumStatus.PUBLISHED}?`,
                  onConfirm: () => handleUpdateCurriculumStatus(CurriculumStatus.PUBLISHED)
                })
              }
            >
              {tc('button.publish')}
            </Button>
          )}

        {/* if staff user is the creator and curriculum is in draft status, then show send request button */}
        {/* {user &&
          user.userRole === UserRole.STAFF &&
          user.userId === curriculum.createdByUserId &&
          curriculum.status === CurriculumStatus.DRAFT && (
            <Button
              className='bg-sky-custom-600 w-30 cursor-pointer font-semibold text-white shadow'
              onClick={() =>
                openModal('confirm', {
                  message: `${tt('confirmMessage.sendRequest', { title: curriculum.title })}`,
                  onConfirm: () => handleUpdateCurriculumStatus(CurriculumStatus.PENDING)
                })
              }
            >
              {tc('button.publish')}
            </Button>
          )} */}

        {/* if staff user is the creator and curriculum is in pending status */}
        {user &&
          user.userRole === UserRole.STAFF &&
          user.userId === curriculum.createdByUserId &&
          curriculum.status === CurriculumStatus.PENDING && (
            <div className='flex w-xs items-center gap-3 rounded-md border border-yellow-300 bg-yellow-50 p-2'>
              <p className='text-xs font-medium text-yellow-700'>{t('custom.reviewMessage')}</p>
            </div>
          )}
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
