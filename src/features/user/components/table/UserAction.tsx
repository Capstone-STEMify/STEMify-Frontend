'use client'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useTranslations } from 'next-intl'

import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import { useDeleteUserMutation } from '../../api/userApi'
import { User, UserStatus } from '@/features/user/types/user.type'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import Image from 'next/image'
import { Badge } from '@/components/shadcn/badge'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { useStatusTranslation } from '@/utils/index'
import UserAvatar from '@/components/shared/UserAvatar'

export function useGetUserAction(): ColumnDef<User>[] {
  const { openModal } = useModal()
  const [deleteUser] = useDeleteUserMutation()
  const t = useTranslations('tableHeader')
  const tt = useTranslations('toast')
  const tm = useTranslations('message')
  const tc = useTranslations('common')
  const statusTranslate = useStatusTranslation()

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
      accessorKey: 'userId',
      header: '',
      cell: ({ row }) => {}
    },
    {
      accessorKey: 'imageUrl',
      header: t('image'),
      cell: ({ row }) => {
        const alt = row.original.userName
        return <UserAvatar fullName={alt || ''} size={32} />
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
        return <div>{tc(`accountType.${role}`)}</div>
      }
    },
    {
      accessorKey: 'status',
      header: t('status'),
      cell: ({ row }) => {
        const value = row.original.status.toString()
        const badgeValue = value.toLocaleUpperCase() as UserStatus
        return <Badge className={`${getStatusBadgeClass(badgeValue)}`}>{statusTranslate(value)}</Badge>
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
