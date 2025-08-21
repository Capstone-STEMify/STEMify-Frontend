'use client'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'

import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import { useDeleteUserMutation } from '../../api/userApi'
import { User } from '../../types/user.type'

export function useGetUserAction(): ColumnDef<User>[] {
  const { openModal } = useModal()
  const [deleteUser] = useDeleteUserMutation()

  const handleDelete = async (id: string, userName: string) => {
    try {
      await deleteUser(id).unwrap()
      toast.success(`Successfully deleted user ${userName}.`)
    } catch (error) {
      toast.error('Failed to delete user.')
    }
  }

  return [
    createSelectColumn<User>(),
    {
      accessorKey: 'userName',
      header: 'Username'
    },
    {
      accessorKey: 'email',
      header: 'Email'
    },
    {
      accessorKey: 'firstName',
      header: 'First Name'
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name'
    },
    {
      accessorKey: 'userRole',
      header: 'Role'
    },
    createActionsColumnFromItems<User>([
      {
        label: 'Edit',
        onClick: ({ original }) => {
          openModal('upsertUser', { id: original.userId })
        }
      },
      {
        label: 'Disable',
        danger: true,
        onClick: async ({ original }) => {
          openModal('confirm', {
            message: `Are you sure you want to disable user "${original.userName}"?`,
            onConfirm: () => handleDelete(original.userId, original.userName)
          })
        }
      }
    ])
  ]
}
