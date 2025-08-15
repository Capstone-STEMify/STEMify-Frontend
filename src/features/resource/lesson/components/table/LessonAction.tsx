import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import { useModal } from '@/providers/ModalProvider'
import { toast } from 'sonner'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import z from 'zod'
import { Badge } from '@/components/shadcn/badge'
import { useDeleteLessonMutation } from '../../api/lessonApi'
import { Lesson, LessonStatus } from '../../types/lesson.type'
import Image from 'next/image'

const getLessonStatusBadgeClass = (status?: LessonStatus): string => {
  const map: Record<LessonStatus, string> = {
    [LessonStatus.DRAFT]: 'bg-gray-200 text-gray-800',
    [LessonStatus.PUBLISHED]: 'bg-blue-100 text-blue-800',
    [LessonStatus.ARCHIVED]: 'bg-yellow-100 text-yellow-800',
    [LessonStatus.DELETED]: 'bg-red-100 text-red-800',
    [LessonStatus.PENDING]: 'bg-amber-100 text-amber-800',
    [LessonStatus.REJECTED]: 'bg-red-200 text-red-900',
    [LessonStatus.APPROVED]: 'bg-green-100 text-green-800'
  }

  return status ? (map[status] ?? 'bg-muted text-muted-foreground') : 'bg-muted text-muted-foreground'
}

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
      accessorKey: 'imageUrl',
      header: () => <div>Image</div>,
      cell: ({ row }) => {
        const src = row.getValue<string>('imageUrl')
        return (
          <div className='h-14 w-14 overflow-hidden rounded border'>
            {src ? (
              <Image src={src} alt='preview' className='h-full w-full object-cover' width={56} height={56} />
            ) : (
              <div className='text-muted flex h-full w-full items-center justify-center text-xs'>No Image</div>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: 'title',
      header: () => <div>Title</div>,
      cell: ({ row }) => <div className='cursor-pointer font-bold'>{row.getValue('title')}</div>
    },
    {
      accessorKey: 'status',
      header: () => <div>Status</div>,
      cell: ({ row }) => {
        const value = row.getValue<LessonStatus>('status')

        return (
          <Badge className={`cursor-pointer ${getLessonStatusBadgeClass(value)}`} variant='outline'>
            {value}
          </Badge>
        )
      }
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
