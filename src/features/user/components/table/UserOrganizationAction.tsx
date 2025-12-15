'use client'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useTranslations } from 'next-intl'

import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import { useDeleteUserMutation } from '../../api/userApi'
import { User, UserStatus } from '@/features/user/types/user.type'
import Image from 'next/image'
import { Badge } from '@/components/shadcn/badge'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { stringToHslColor, useOrgUserStatusTranslation, useStatusTranslation } from '@/utils/index'

export function useGetOrganizationUserAction(): ColumnDef<User>[] {
  const { openModal } = useModal()
  const translationStatus = useStatusTranslation()
  const [deleteUser] = useDeleteUserMutation()
  const t = useTranslations('tableHeader')
  const tt = useTranslations('toast')
  const tm = useTranslations('message')
  const tc = useTranslations('common')

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
        const alt = row.original.fullName
        return (
          <div
            className='flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white shadow-sm ring-1 ring-black/5 select-none'
            style={{
              backgroundColor: stringToHslColor(alt || '')
            }}
          >
            {alt?.charAt(0).toUpperCase()}
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
        const role = row.original.subscriptions[0].licenseType
        return <div>{tc(`accountType.${role.toLowerCase()}`)}</div>
      }
    },
    {
      accessorKey: 'status',
      header: t('status'),
      cell: ({ row }) => {
        const status = row.original.isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE
        return <Badge className={getStatusBadgeClass(status)}>{translationStatus(status)}</Badge>
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
