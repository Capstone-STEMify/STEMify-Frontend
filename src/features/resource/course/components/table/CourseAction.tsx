import React from 'react'
import { Course, CourseLevel, CourseStatus } from '../../types/course.type'
import { ColumnDef } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import { useModal } from '@/providers/ModalProvider'
import { useDeleteCourseMutation, useUpdateCourseMutation } from '../../api/courseApi'
import { toast } from 'sonner'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import z from 'zod'
import { Badge } from '@/components/shadcn/badge'
import Image from 'next/image'

export const courseTableSchema = z.object({
  id: z.number()
})

const levelBadgeClass = (level?: string): string => {
  const map: Record<string, string> = {
    [CourseLevel.BEGINNER]: 'bg-green-100 text-green-800',
    [CourseLevel.INTERMEDIATE]: 'bg-yellow-100 text-yellow-800',
    [CourseLevel.ADVANCED]: 'bg-red-100 text-red-800'
  }
  return map[level ?? ''] ?? 'bg-muted text-muted-foreground'
}

const getCourseStatusBadgeClass = (status?: CourseStatus): string => {
  const map: Record<CourseStatus, string> = {
    [CourseStatus.DRAFT]: 'bg-gray-200 text-gray-800',
    [CourseStatus.PUBLISHED]: 'bg-blue-100 text-blue-800',
    [CourseStatus.ARCHIVED]: 'bg-yellow-100 text-yellow-800',
    [CourseStatus.DELETED]: 'bg-red-100 text-red-800',
    [CourseStatus.PENDING]: 'bg-amber-100 text-amber-800',
    [CourseStatus.REJECTED]: 'bg-red-200 text-red-900',
    [CourseStatus.APPROVED]: 'bg-green-100 text-green-800'
  }

  return status ? (map[status] ?? 'bg-muted text-muted-foreground') : 'bg-muted text-muted-foreground'
}

export function useGetCourseAction(): ColumnDef<Course>[] {
  const router = useRouter()
  const { openModal } = useModal()
  const [deleteCourse] = useDeleteCourseMutation() // Hook for deletion
  const [updateCourseStatus] = useUpdateCourseMutation()

  const handleDelete = async (id: number) => {
    try {
      await deleteCourse(id).unwrap()
      toast.success(`Successfully deleted course ${id}.`)
    } catch (error) {
      toast.error('Failed to delete course.')
    }
  }

  const handleStatusUpdate = async (id: number, title: string, status: CourseStatus) => {
    const action = status === CourseStatus.APPROVED ? 'approve' : 'reject'
    openModal('confirm', {
      message: `Are you sure you want to ${action} course "${title}"?`,
      onConfirm: async () => {
        try {
          await updateCourseStatus({ id, body: { status } }).unwrap()
          toast.success(`${action.charAt(0).toUpperCase() + action.slice(1)}d course "${title}"`)
        } catch {
          toast.error(`Failed to ${action} course.`)
        }
      }
    })
  }

  return [
    createSelectColumn<Course>(),
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }) => row.getValue('code')
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
      accessorKey: 'level',
      header: () => <div>Level</div>,
      cell: ({ row }) => {
        const value = row.getValue<string>('level')
        return (
          <Badge className={`cursor-pointer ${levelBadgeClass(value)}`} variant='outline'>
            {value}
          </Badge>
        )
      }
    },
    {
      accessorKey: 'status',
      header: () => <div>Status</div>,
      cell: ({ row }) => {
        const value = row.getValue<CourseStatus>('status')

        return (
          <Badge className={`cursor-pointer ${getCourseStatusBadgeClass(value)}`} variant='outline'>
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
    createActionsColumnFromItems<Course>([
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
      },
      {
        separatorBefore: true,
        label: 'Approve',
        hidden: ({ original }) => original.status !== CourseStatus.PENDING,
        onClick: ({ original }) => handleStatusUpdate(original.id, original.title, CourseStatus.APPROVED)
      },
      {
        label: 'Reject',
        danger: true,
        hidden: ({ original }) => original.status !== CourseStatus.PENDING,
        onClick: ({ original }) => handleStatusUpdate(original.id, original.title, CourseStatus.REJECTED)
      }
    ])
  ]
}
