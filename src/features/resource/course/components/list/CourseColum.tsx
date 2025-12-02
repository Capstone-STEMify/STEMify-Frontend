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
import SStatusDropdown from '@/components/shared/SStatusDropdown'
import { original } from '@reduxjs/toolkit'

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

  const statusOptions = [
    { label: 'Draft', value: CourseStatus.DRAFT },
    { label: 'Published', value: CourseStatus.PUBLISHED }
  ]
  const statusFlow: Record<CourseStatus, CourseStatus[]> = {
    [CourseStatus.DRAFT]: [CourseStatus.DRAFT, CourseStatus.PUBLISHED],
    [CourseStatus.PUBLISHED]: [CourseStatus.PUBLISHED],
    [CourseStatus.DELETED]: [],
    [CourseStatus.ARCHIVED]: []
  }

  const handleStatusChange = (courseId: number, newStatus: string) => {
    if (newStatus === CourseStatus.DELETED) {
      openModal('confirm', {
        message: 'Are you sure you want to delete this course?',
        onConfirm: async () => {
          await deleteCourse(courseId)
          toast.success('Course deleted successfully')
        }
      })
      return
    }

    updateCourseStatus({ id: courseId, body: { status: newStatus as CourseStatus } })
      .unwrap()
      .then(() => toast.success(tt('successMessage.update', { title: newStatus })))
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
        const value = row.original
        const allowedOptions = statusOptions.filter(
          (l) => value && statusFlow[value.status]?.includes(l.value as CourseStatus)
        )

        return (
          <SStatusDropdown
            value={value.status!}
            options={allowedOptions}
            onChange={(newStatus) => handleStatusChange(row.original.id, newStatus)}
          />
        )
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
        hidden: ({ original }) => curriculumId !== undefined || original.status !== CourseStatus.DRAFT,
        onClick: async ({ original }) => {
          // Open the confirmation modal for deletion
          openModal('confirm', {
            message: tt('confirmMessage.delete', { title: original.title }),
            onConfirm: () => handleDelete(original.id)
          })
        }
      },
      {
        label: tc('button.archive'),
        hidden: ({ original }) => curriculumId !== undefined || original.status !== CourseStatus.PUBLISHED,
        onClick: async ({ original }) => {
          // Open the confirmation modal for deletion
          openModal('confirm', {
            message: tt('confirmMessage.archive', { title: original.title }),
            onConfirm: () => handleStatusUpdate(original.id, original.title, CourseStatus.ARCHIVED)
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
      }
    ])
  ]
}
