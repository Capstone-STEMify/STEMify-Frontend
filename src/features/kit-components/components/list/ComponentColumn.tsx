import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useDeleteComponentMutation, useUpdateComponentMutation } from '@/features/kit-components/api/kitComponentApi'
import { Component } from '@/features/kit-components/types/kit-component.type'
import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import z from 'zod'

export const componentTableSchema = z.object({
  id: z.number()
})

export function useGetComponentColumn({ isPopup }: { isPopup?: boolean }): ColumnDef<Component>[] {
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const tm = useTranslations('message')

  const router = useRouter()
  const { openModal } = useModal()
  const [deleteComponent] = useDeleteComponentMutation()
  const [updateComponentStatus] = useUpdateComponentMutation()
  const [deleteComponentFromCurriculum] = useDeleteComponentMutation()
  const locale = useLocale()
  const { curriculumId } = useParams()

  const handleDelete = async (id: number) => {
    try {
      await deleteComponent(id).unwrap()
      toast.success(tt('successMessage.delete'))
    } catch (error) {
      toast.error(tt('errorMessage'))
    }
  }

  return [
    createSelectColumn<Component>(),
    {
      accessorKey: 'imageUrl',
      header: () => <div className='w-36 text-center'>{tc('tableHeader.image')}</div>,
      cell: ({ row }) => {
        const src = row.getValue<string>('imageUrl')
        return (
          <div className='flex h-16 w-36 justify-center overflow-hidden rounded'>
            {src ? (
              <Image src={src} alt='preview' className='aspect-square object-contain' width={65} height={65} />
            ) : (
              <div className='text-muted flex h-full w-full items-center justify-center text-xs'>{tc('noImage')}</div>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: 'name',
      header: () => <div>{tc('tableHeader.name')}</div>,
      cell: ({ row }) => {
        const courseId = row.original.id
        return (
          <div className='line-clamp-3 w-48 whitespace-pre-wrap'>
            {isPopup ? (
              <div className='font-bold'>{row.getValue('name')}</div>
            ) : (
              <div onClick={() => {}} className='cursor-pointer font-bold transition hover:opacity-80'>
                {row.getValue('name')}
              </div>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: 'description',
      header: () => <div>{tc('tableHeader.description')}</div>,
      cell: ({ row }) => {
        return <div className='line-clamp-5 w-md whitespace-pre-wrap'>{row.getValue('description')}</div>
      }
    },
    createActionsColumnFromItems<Component>([
      {
        label: tc('button.update'),
        onClick: ({ original }) => {
          openModal('upsertComponent', { componentId: original.id })
        }
      },
      {
        label: tc('button.delete'),
        onClick: async ({ original }) => {
          // Open the confirmation modal for deletion
          openModal('confirm', {
            message: tt('confirmMessage.delete', { title: original.name }),
            onConfirm: () => handleDelete(original.id)
          })
        }
      }
    ])
  ]
}
