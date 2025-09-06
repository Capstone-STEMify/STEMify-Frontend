import { createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useDeleteSectionMutation } from '@/features/resource/section/api/sectionApi'
import { Section } from '@/features/resource/section/types/section.type'
import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { Edit, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'
import { toast } from 'sonner'

export default function useGetSectionTableColumn(): ColumnDef<Section>[] {
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const t = useTranslations('section')
  const { openModal } = useModal()

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
        return <div className='line-clamp-5 w-32 font-semibold whitespace-pre-wrap'>{row.getValue('title')}</div>
      }
    },
    {
      accessorKey: 'duration',
      header: `${tc('tableHeader.duration')}`,
      cell: ({ row }) => {
        return (
          <div className='w-32'>
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
