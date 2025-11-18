import { createSelectColumn, DragHandle } from '@/components/shared/data-table/columns-helpers'
import { useDeleteSectionMutation } from '@/features/resource/section/api/sectionApi'
import { Section } from '@/features/resource/section/types/section.type'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { LicenseType, UserRole } from '@/types/userRole'
import { ColumnDef, Row } from '@tanstack/react-table'
import { Edit, ExternalLink, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

export default function useGetSectionTableColumn(): ColumnDef<Section>[] {
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const t = useTranslations('section')
  const { openModal } = useModal()
  const userRole = useAppSelector((state) => state.selectedOrganization.currentRole)

  const [deleteSection] = useDeleteSectionMutation()
  const handleDelete = async (sectionId: number) => {
    try {
      await deleteSection(sectionId).unwrap()
      toast.success(tc('successMessage.delete'))
    } catch (err) {
      toast.error(tc('errorMessage'))
    }
  }

  return [
    createSelectColumn<Section>(),
    {
      accessorKey: 'title',
      header: tc('tableHeader.title'),
      cell: ({ row }) => {
        return (
          <>
            {userRole === LicenseType.TEACHER ? (
              <div className='line-clamp-5 w-32 whitespace-pre-wrap'>{row.getValue('title')}</div>
            ) : (
              <div
                className='line-clamp-5 w-32 cursor-pointer whitespace-pre-wrap text-blue-500 italic underline'
                onClick={() => {
                  openModal('contentDetail', { sectionId: row.original.id })
                }}
              >
                {row.getValue('title')}
                <ExternalLink className='ml-1 inline' size={14} />
              </div>
            )}
          </>
        )
      }
    },
    {
      accessorKey: 'duration',
      header: `${tc('tableHeader.duration')}`,
      cell: ({ row }) => {
        return (
          <div className='w-20'>
            {row.getValue('duration')} {tc('unit.minute')}
          </div>
        )
      }
    },
    {
      accessorKey: 'description',
      header: tc('tableHeader.description'),
      cell: ({ row }) => {
        return <div className='line-clamp-5 w-md whitespace-pre-wrap'>{row.getValue('description')}</div>
      }
    },
    {
      accessorKey: 'actions',
      header: '',
      cell: ({ row }) => {
        if (userRole === LicenseType.TEACHER) return null

        return (
          <div className='flex justify-center gap-2'>
            <Edit
              size={16}
              className='cursor-pointer text-blue-500 hover:text-blue-600'
              onClick={() => {
                openModal('upsertSection', { sectionId: row.original.id })
              }}
            />
            <Trash2
              size={16}
              className='cursor-pointer text-red-500 hover:text-red-600'
              onClick={() =>
                openModal('confirm', {
                  message: tt('confirmMessage.delete', { title: row.original.title }),
                  onConfirm: () => handleDelete(row.original.id)
                })
              }
            />
          </div>
        )
      }
    }
  ]
}
