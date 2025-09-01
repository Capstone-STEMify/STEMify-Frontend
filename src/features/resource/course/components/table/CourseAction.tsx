'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
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
import { useLocale } from 'next-intl'
import { getCourseStatusBadgeClass } from '@/utils/badgeColor'

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

export function useGetCourseAction(): ColumnDef<Course>[] {
  const router = useRouter()
  const { openModal } = useModal()
  const [deleteCourse] = useDeleteCourseMutation()
  const [updateCourseStatus] = useUpdateCourseMutation()
  const locale = useLocale()
  const tc = useTranslations('common')

  const handleDelete = async (id: number) => {
    try {
      await deleteCourse(id).unwrap()
      toast.success(`Successfully deleted course ${id}.`)
    } catch (error) {
      toast.error('Failed to delete course.')
    }
  }

  const handleStatusUpdate = async (id: number, title: string, status: CourseStatus) => {
    const action = status === CourseStatus.PUBLISHED ? 'publish' : 'reject'
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
      header: tc('tableHeader.code'),
      cell: ({ row }) => row.getValue('code')
    },
    {
      accessorKey: 'imageUrl',
      header: () => <div>{tc('tableHeader.image')}</div>,
      cell: ({ row }) => {
        const src = row.getValue<string>('imageUrl')
        return (
          <div className='h-14 w-14 overflow-hidden rounded border'>
            {src ? (
              <Image src={src} alt='preview' className='h-full w-full object-cover' width={56} height={56} />
            ) : (
              <div className='text-muted flex h-full w-full items-center justify-center text-xs'>{tc('noImage')}</div>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: 'title',
      header: () => <div>{tc('tableHeader.title')}</div>,
      cell: ({ row }) => {
        const courseId = row.original.id
        return (
          <div
            onClick={() => router.push(`/${locale}/admin/course/${courseId}`)}
            className='cursor-pointer font-bold transition hover:opacity-80'
          >
            {row.getValue('title')}
          </div>
        )
      }
    },
    {
      accessorKey: 'level',
      header: () => <div>{tc('tableHeader.level')}</div>,
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
      header: () => <div>{tc('tableHeader.status')}</div>,
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
      header: () => <div>{tc('tableHeader.createdBy')}</div>,
      cell: ({ row }) => {
        const value = row.getValue<string>('createdByUserName')
        const display = value?.trim() ? value : 'STEMify Staff'
        return <div className='cursor-pointer'>{display}</div>
      }
    },
    {
      accessorKey: 'createdDate',
      header: () => <div>{tc('tableHeader.createdDate')}</div>,
      cell: ({ row }) => {
        const raw = row.getValue<string>('createdDate')
        const date = raw ? new Date(raw).toLocaleDateString('vi-VN') : 'N/A'
        return <div>{date}</div>
      }
    },
    createActionsColumnFromItems<Course>([
      {
        label: tc('button.update'),
        onClick: ({ original }) => {
          router.push(`/${locale}/admin/course/update/${original.id}`)
        }
      },
      {
        label: tc('button.delete'),
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
        label: tc('button.approve'),
        hidden: ({ original }) => original.status !== CourseStatus.PENDING && original.status !== CourseStatus.DRAFT,
        onClick: ({ original }) => handleStatusUpdate(original.id, original.title, CourseStatus.PUBLISHED)
      },
      {
        label: tc('button.reject'),
        danger: true,
        hidden: ({ original }) => original.status !== CourseStatus.PENDING && original.status !== CourseStatus.DRAFT,
        onClick: ({ original }) => handleStatusUpdate(original.id, original.title, CourseStatus.REJECTED)
      }
    ])
  ]
}
