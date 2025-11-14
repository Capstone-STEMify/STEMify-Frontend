'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import { Course, CourseLevel, CourseStatus } from '../../types/course.type'
import { ColumnDef, Row } from '@tanstack/react-table'
import { useParams, useRouter } from 'next/navigation'
import { useModal } from '@/providers/ModalProvider'
import { useDeleteCourseMutation, useUpdateCourseMutation } from '../../api/courseApi'
import { toast } from 'sonner'
import {
  createActionsColumnFromItems,
  createSelectColumn,
  DragHandle
} from '@/components/shared/data-table/columns-helpers'
import z from 'zod'
import { Badge } from '@/components/shadcn/badge'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { useDeleteCourseFromCurriculumMutation } from '@/features/resource/curriculum/api/curriculumApi'

export const courseTableSchema = z.object({
  id: z.number()
})

export function useGetCourseColumn({ isPopup }: { isPopup?: boolean }): ColumnDef<Course>[] {
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const tm = useTranslations('message')

  const router = useRouter()
  const { openModal } = useModal()
  const [deleteCourse] = useDeleteCourseMutation()
  const [updateCourseStatus] = useUpdateCourseMutation()
  const [deleteCourseFromCurriculum] = useDeleteCourseFromCurriculumMutation()
  const locale = useLocale()
  const { curriculumId } = useParams()

  const handleDelete = async (id: number) => {
    try {
      await deleteCourse(id).unwrap()
      toast.success(tt('successMessage.delete'))
    } catch (error) {
      toast.error(tt('errorMessage'))
    }
  }

  const handleStatusUpdate = async (id: number, title: string, status: CourseStatus) => {
    const action = status === CourseStatus.PUBLISHED ? 'publish' : 'reject'
    openModal('confirm', {
      message: tt('confirmMessage.askStatus', { action, title }),
      onConfirm: async () => {
        try {
          await updateCourseStatus({ id, body: { status } }).unwrap()

          const actionText = action.charAt(0).toUpperCase() + action.slice(1) + 'd'
          toast.success(tt('successMessage.action', { action: actionText, title }))
        } catch {
          toast.error(tt('errorSpecific.status', { status: action }))
        }
      }
    })
  }

  const handleRemoveCourse = async (courseIds: number[]) => {
    try {
      await deleteCourseFromCurriculum({ curriculumId: Number(curriculumId!), courseIds }).unwrap()
      toast.success(tt('successMessage.removeCourseFromCurriculum'))
    } catch (error) {
      toast.error(tt('errorMessage'))
    }
  }

  return [
    createSelectColumn<Course>(),
    {
      accessorKey: 'code',
      header: tc('tableHeader.code'),
      enableSorting: true,
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
          <div className='line-clamp-3 w-32 whitespace-pre-wrap'>
            {isPopup ? (
              <div className='font-bold'>{row.getValue('title')}</div>
            ) : (
              <div
                onClick={() => router.push(`/${locale}/admin/course/${courseId}`)}
                className='cursor-pointer font-bold transition hover:opacity-80'
              >
                {row.getValue('title')}
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
    {
      accessorKey: 'status',
      header: () => <div>{tc('tableHeader.status')}</div>,
      cell: ({ row }) => {
        const value = row.getValue<CourseStatus>('status')
        return <Badge className={`cursor-pointer ${getStatusBadgeClass(value)}`}>{value}</Badge>
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
        label: tc('button.view'),
        onClick: ({ original }) => {
          router.push(`/${locale}/admin/course/${original.id}`)
        }
      },
      {
        label: tc('button.delete'),
        danger: true,
        hidden: () => curriculumId !== undefined,
        onClick: async ({ original }) => {
          // Open the confirmation modal for deletion
          openModal('confirm', {
            message: tt('confirmMessage.delete', { title: original.title }),
            onConfirm: () => handleDelete(original.id)
          })
        }
      },
      {
        label: tc('button.remove'),
        danger: true,
        hidden: () => curriculumId === undefined,
        onClick: async ({ original }) => {
          // Open the confirmation modal for removing course from curriculum
          openModal('confirm', {
            message: tt('confirmMessage.removeCourse', { title: original.title }),
            onConfirm: () => handleRemoveCourse([original.id])
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
