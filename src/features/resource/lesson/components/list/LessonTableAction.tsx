import React from 'react'
import { useTranslations } from 'next-intl'
import { ColumnDef, Row } from '@tanstack/react-table'
import { useParams, useRouter } from 'next/navigation'
import { useModal } from '@/providers/ModalProvider'
import { toast } from 'sonner'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { Badge } from '@/components/shadcn/badge'
import { useDeleteLessonMutation, useUpdateLessonMutation } from '../../api/lessonApi'
import { Lesson, LessonStatus } from '../../types/lesson.type'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { useSortable } from '@dnd-kit/sortable'
import { Button } from '@/components/shadcn/button'
import { IconGripVertical } from '@tabler/icons-react'

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

function DragHandle({ id }: { id: number }) {
  const { attributes, listeners, setNodeRef } = useSortable({ id })

  return (
    <Button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      variant='ghost'
      size='icon'
      className='hover:cursor-grab active:cursor-grabbing'
    >
      <IconGripVertical className='text-muted-foreground size-3' />
      <span className='sr-only'>Drag to reorder</span>
    </Button>
  )
}

export function useGetLessonAction(): ColumnDef<Lesson>[] {
  const router = useRouter()
  const locale = useLocale()
  const { openModal } = useModal()
  const [deleteLesson] = useDeleteLessonMutation()
  const [updateLessonStatus] = useUpdateLessonMutation()
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
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

  return [
    ...(courseId
      ? [
          {
            id: 'drag',
            header: () => null,
            cell: ({ row }: { row: Row<Lesson> }) => <DragHandle id={row.original.id} />,
            enableSorting: false,
            enableHiding: false
          }
        ]
      : []),
    createSelectColumn<Lesson>(),
    {
      accessorKey: 'id',
      header: tc('tableHeader.id'),
      cell: ({ row }) => row.getValue('id')
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
            message: `Are you sure you want to delete lesson "${original.title}"?`,
            onConfirm: () => handleDelete(original.id)
          })
        }
      },
      {
        separatorBefore: true,
        label: tc('button.approve'),
        hidden: ({ original }) => original.status !== LessonStatus.PENDING && original.status !== LessonStatus.DRAFT,
        onClick: ({ original }) => handleStatusUpdate(original.id, original.title, LessonStatus.PUBLISHED)
      },
      {
        label: tc('button.reject'),
        danger: true,
        hidden: ({ original }) => original.status !== LessonStatus.PENDING && original.status !== LessonStatus.DRAFT,
        onClick: ({ original }) => handleStatusUpdate(original.id, original.title, LessonStatus.REJECTED)
      }
    ])
  ]
}
