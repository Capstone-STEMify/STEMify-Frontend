import React from 'react'
import { Course } from '../../types/course.type'
import { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import { useModal } from '@/providers/ModalProvider'
import { useDeleteCourseMutation } from '../../api/courseApi'
import { toast } from 'sonner'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import z from 'zod'
import { Badge } from '@/components/shadcn/badge'

export const courseTableSchema = z.object({
  id: z.number()
})

export function useGetCourseAction(): ColumnDef<Course>[] {
  const router = useRouter()
  const { openModal } = useModal()
  const [deleteCourse] = useDeleteCourseMutation() // Hook for deletion

  const handleDelete = async (id: number) => {
    try {
      await deleteCourse(id).unwrap()
      toast.success(`Successfully deleted course ${id}.`)
    } catch (error) {
      toast.error('Failed to delete course.')
    }
  }

  return [
    createSelectColumn<Course>(),
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }) => row.getValue('code')
    },
    {
      accessorKey: 'title',
      header: () => <div>Title</div>,
      cell: ({ row }) => <div className='cursor-pointer font-bold underline'>{row.getValue('title')}</div>
    },
    {
      accessorKey: 'level',
      header: () => <div>Level</div>,
      cell: ({ row }) => (
        <Badge className='cursor-pointer' variant={'outline'}>
          {row.getValue('level')}
        </Badge>
      )
    },
    {
      accessorKey: 'status',
      header: () => <div>Status</div>,
      cell: ({ row }) => (
        <Badge className='cursor-pointer' variant={'outline'}>
          {row.getValue('status')}
        </Badge>
      )
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
    createActionsColumnFromItems<Course>([
      {
        label: 'Copy Id',
        onClick: ({ original }) => {
          navigator.clipboard.writeText(original.id.toString())
          toast.info('Course ID copied to clipboard!')
        }
      },
      {
        label: 'View details',
        separatorBefore: true,
        onClick: ({ original }) => router.push(`/admin/course/${original.id}`)
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
            message: `Are you sure you want to delete course "${original.title}"?`,
            onConfirm: () => handleDelete(original.id)
          })
        }
      }
    ])
  ]
}
