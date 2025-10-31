'use client'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useTranslations } from 'next-intl'

import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import { useDeleteUserMutation } from '../../api/userApi'
import { User } from '@/features/user/types/user.type'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'

export function useGetUserAction(): ColumnDef<User>[] {
  const { openModal } = useModal()
  const [deleteUser] = useDeleteUserMutation()
  const t = useTranslations('tableHeader')
  const tt = useTranslations('toast')
  const tm = useTranslations('message')

  const handleDelete = async (id: string, userName: string) => {
    try {
      await deleteUser(id).unwrap()
      toast.success(tt('successMessage.delete', { title: userName }))
    } catch (error) {
      toast.error(tt('errorMessage'))
    }
  }

  return [
    createSelectColumn<User>(),
    {
      accessorKey: 'avatar',
      header: t('avatar'),
      cell: ({ row }) => {
        const imageUrl = row.original.imageUrl
        return (
          <div>
            <Avatar>
              <AvatarImage src={imageUrl} alt={row.original.userName} />
              <AvatarFallback>{row.original.userName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        )
      }
    },
    {
      accessorKey: 'userName',
      header: t('userName')
    },
    {
      accessorKey: 'email',
      header: t('email')
    },
    {
      accessorKey: 'firstName',
      header: t('firstName')
    },
    {
      accessorKey: 'lastName',
      header: t('lastName')
    },
    {
      accessorKey: 'userRole',
      header: t('userRole'),
      cell: ({ row }) => {
        const role = row.original.userRole
        return <div>{role}</div>
      }
    },
    createActionsColumnFromItems<User>([
      {
        label: t('edit'),
        onClick: ({ original }) => {
          openModal('upsertUser', { id: original.userId })
        }
      },
      {
        label: t('disable'),
        danger: true,
        onClick: async ({ original }) => {
          openModal('confirm', {
            message: tm('confirmDelMessage', { title: original.userName }),
            onConfirm: () => handleDelete(original.userId, original.userName)
          })
        }
      }
    ])
  ]
}
