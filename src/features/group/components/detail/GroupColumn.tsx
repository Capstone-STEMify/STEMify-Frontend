import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useLocale, useTranslations } from 'next-intl'
import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import { GroupDetailStudent } from '@/features/group/types/group.type'
import { useDeleteGroupMutation } from '@/features/group/api/groupApi'
import { Badge } from '@/components/shadcn/badge'
import { Avatar, AvatarFallback } from '@/components/shadcn/avatar'
import { formatDate, useOrgUserStatusTranslation } from '@/utils/index'

export function useGetGroupColumn(): ColumnDef<GroupDetailStudent>[] {
  const { openModal } = useModal()
  const locale = useLocale()
  const [deleteGroup] = useDeleteGroupMutation()
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const orgUserStatusTranslation = useOrgUserStatusTranslation()

  const handleDelete = async (id: string) => {
    try {
      await deleteGroup(id).unwrap()
      toast.success(tt('successMessage.delete'))
    } catch (error) {
      toast.error(tt('errorMessage'))
    }
  }

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return [
    createSelectColumn<GroupDetailStudent>(),
    {
      accessorKey: 'fullName',
      header: tc('tableHeader.student'),
      cell: ({ row }) => {
        const student = row.original
        return (
          <div className='flex items-center gap-3'>
            <Avatar className='h-10 w-10'>
              <AvatarFallback className='bg-primary/10 text-primary font-semibold'>
                {getInitials(student.fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className='font-medium'>{student.fullName}</div>
              <div className='text-sm text-gray-500'>{student.userName}</div>
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: 'email',
      header: tc('tableHeader.email'),
      cell: ({ row }) => <div className='text-sm'>{row.original.email}</div>
    },
    {
      accessorKey: 'isActive',
      header: tc('tableHeader.status'),
      cell: ({ row }) => (
        <Badge className={row.original.isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
          {row.original.isActive ? orgUserStatusTranslation('active') : orgUserStatusTranslation('inactive')}
        </Badge>
      )
    },
    {
      accessorKey: 'subscriptionOrderId',
      header: tc('tableHeader.subscription'),
      cell: ({ row }) => <div className='font-mono text-sm'>#{row.original.subscriptionOrderId}</div>
    },
    {
      accessorKey: 'joinedAt',
      header: tc('tableHeader.joinedAt'),
      cell: ({ row }) => <div className='text-sm text-gray-600'>{formatDate(row.original.joinedAt, { locale })}</div>
    },
    createActionsColumnFromItems<GroupDetailStudent>([
      // {
      //   label: tc('button.viewDetails'),
      //   onClick: ({ original }) => {
      //     openModal('studentDetails', { studentId: original.organizationUserId })
      //   }
      // },
      // {
      //   label: tc('button.update'),
      //   onClick: ({ original }) => {
      //     openModal('upsertStudent', { id: original.organizationUserId })
      //   }
      // },
      {
        label: tc('button.removeFromGroup'),
        danger: true,
        onClick: async ({ original }) => {
          openModal('confirm', {
            message: `${tt('confirmMessage.remove', { title: original.fullName })}`,
            onConfirm: () => handleDelete(original.organizationUserId)
          })
        }
      }
    ])
  ]
}
