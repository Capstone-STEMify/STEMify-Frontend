import React from 'react'
import { useTranslations } from 'next-intl'
import { ColumnDef } from '@tanstack/react-table'
import { useParams, useRouter } from 'next/navigation'
import { useModal } from '@/providers/ModalProvider'
import { toast } from 'sonner'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useDeleteLessonMutation, useUpdateLessonMutation } from '../../api/lessonApi'
import { Lesson, LessonStatus } from '../../types/lesson.type'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import SStatusDropdown from '@/components/shared/SStatusDropdown'

export function useGetLessonColumn(): ColumnDef<Lesson>[] {
  const router = useRouter()
  const locale = useLocale()
  const { openModal } = useModal()
  const [deleteLesson] = useDeleteLessonMutation()
  const [updateLessonStatus] = useUpdateLessonMutation()
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const tm = useTranslations('message')
  const { courseId } = useParams()

  const handleDelete = async (id: number) => {
    try {
      await deleteLesson(id).unwrap()
      toast.success(tt('successMessage.delete'))
    } catch (error) {
      toast.error(tt('errorMessage'))
    }
  }

  const handleStatusUpdate = async (id: number, title: string, status: LessonStatus) => {
    const action = status === LessonStatus.PUBLISHED ? 'publish' : 'reject'
    openModal('confirm', {
      message: tt('confirmMessage.askStatus', { action, title }),
      onConfirm: async () => {
        try {
          await updateLessonStatus({ id, body: { status } }).unwrap()

          const actionText = action.charAt(0).toUpperCase() + action.slice(1) + 'd'
          toast.success(tt('successMessage.action', { action: actionText, title }))
        } catch {
          toast.error(tt('errorSpecific.status'))
        }
      }
    })
  }

  const handleNavigatePacingGuide = (id: number) => {
    router.push(`/${locale}/admin/lesson/${id}/pacing-guide`)
  }

  const statusOptions = [
    { label: 'Draft', value: LessonStatus.DRAFT },
    { label: 'Published', value: LessonStatus.PUBLISHED }
  ]
  const statusFlow: Record<LessonStatus, LessonStatus[]> = {
    [LessonStatus.DRAFT]: [LessonStatus.DRAFT, LessonStatus.PUBLISHED],
    [LessonStatus.PUBLISHED]: [LessonStatus.PUBLISHED],
    [LessonStatus.DELETED]: [],
    [LessonStatus.ARCHIVED]: []
  }

  const handleStatusChange = (lessonId: number, newStatus: string) => {
    if (newStatus === LessonStatus.DELETED) {
      openModal('confirm', {
        message: 'Are you sure you want to delete this lesson?',
        onConfirm: async () => {
          await deleteLesson(lessonId)
          toast.success('Lesson deleted successfully')
        }
      })
      return
    }

    updateLessonStatus({ id: lessonId, body: { status: newStatus as LessonStatus } })
      .unwrap()
      .then(() => toast.success(tt('successMessage.update', { title: newStatus })))
  }

  return [
    createSelectColumn<Lesson>(),
    {
      accessorKey: 'id',
      header: tc('tableHeader.id'),
      cell: ({ row }) => {
        return courseId ? row.index + 1 : row.getValue('id')
      }
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
        const lessonId = row.original.id
        return (
          <div
            onClick={() => handleNavigatePacingGuide(lessonId)}
            className='cursor-pointer font-bold transition hover:opacity-80'
          >
            {row.getValue('title')}
          </div>
        )
      },
      enableSorting: true
    },
    {
      accessorKey: 'status',
      header: () => <div>{tc('tableHeader.status')}</div>,
      cell: ({ row }) => {
        const value = row.original
        const allowedOptions = statusOptions.filter(
          (l) => value && statusFlow[value.status]?.includes(l.value as LessonStatus)
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
    createActionsColumnFromItems<Lesson>([
      {
        label: tc('button.view'),
        onClick: ({ original }) => {
          router.push(`/${locale}/admin/lesson/${original.id}/pacing-guide`)
        }
      },
      {
        label: tc('button.delete'),
        danger: true,
        onClick: async ({ original }) => {
          // Open the confirmation modal for deletion
          openModal('confirm', {
            message: tt('confirmMessage.delete', { title: original.title }),
            onConfirm: () => handleDelete(original.id)
          })
        }
      }
    ])
  ]
}
