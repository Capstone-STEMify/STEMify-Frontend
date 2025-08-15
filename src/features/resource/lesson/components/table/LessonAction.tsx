import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import { useModal } from '@/providers/ModalProvider'
import { toast } from 'sonner'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import z from 'zod'
import { Badge } from '@/components/shadcn/badge'
import { useDeleteLessonMutation } from '../../api/lessonApi'
import { Lesson } from '../../types/lesson.type'

export const lessonTableSchema = z.object({
  id: z.number()
})

export function useGetLessonAction(): ColumnDef<Lesson>[] {
  const router = useRouter()
  const { openModal } = useModal()
  const [deleteLesson] = useDeleteLessonMutation()

  const handleDelete = async (id: number) => {
    try {
      await deleteLesson(id).unwrap()
      toast.success(`Successfully deleted lesson ${id}.`)
    } catch (error) {
      toast.error('Failed to delete lesson.')
    }
  }

  return [
    createSelectColumn<Lesson>(),
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => row.getValue('id')
    },
    {
      accessorKey: 'title',
      header: () => <div>Title</div>,
      cell: ({ row }) => <div className='cursor-pointer font-bold underline'>{row.getValue('title')}</div>
    },
    {
      accessorKey: 'status',
      header: () => <div>Status</div>,
      cell: ({ row }) => <Badge variant={'outline'}>{row.getValue('status')}</Badge>
    },
    {
      accessorKey: 'createdByUserName',
      header: () => <div>Created By</div>,
      cell: ({ row }) => {
        const value = row.getValue<string>('createdByUserName')
        const display = value?.trim() ? value : 'STEMify Staff'
        return <div className='cursor-pointer'>{display}</div>
      }
    },
    {
      accessorKey: 'createdDate',
      header: () => <div>Created Date</div>,
      cell: ({ row }) => {
        const raw = row.getValue<string>('createdDate')
        const date = raw ? new Date(raw).toLocaleDateString('vi-VN') : 'N/A'
        return <div>{date}</div>
      }
    },
    createActionsColumnFromItems<Lesson>([
      {
        label: 'Copy Id',
        onClick: ({ original }) => {
          navigator.clipboard.writeText(original.id.toString())
          toast.info('Lesson ID copied to clipboard!')
        }
      },
      {
        label: 'View details',
        separatorBefore: true,
        onClick: ({ original }) => router.push(`/admin/lesson/${original.id}`)
      },
      {
        label: 'Edit',
        onClick: ({ original }) => {
          // Open the upsert modal in "edit" mode
          //   openModal('upsertCourse', { id: original.id })
        }
      },
      {
        label: 'Delete',
        danger: true,
        onClick: async ({ original }) => {
          // Open the confirmation modal for deletion
          openModal('confirm', {
            message: `Are you sure you want to delete lesson "${original.title}"?`,
            onConfirm: () => handleDelete(original.id)
          })
        }
      }
    ])
  ]
}
