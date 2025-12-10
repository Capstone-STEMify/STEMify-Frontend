import React from 'react'
import { useTranslations } from 'next-intl'
import { ColumnDef } from '@tanstack/react-table'
import { useParams, useRouter } from 'next/navigation'
import { useModal } from '@/providers/ModalProvider'
import { toast } from 'sonner'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import SStatusDropdown from '@/components/shared/SStatusDropdown'
import { Organization, OrganizationStatus } from '@/features/organization/types/organization.type'
import {
  useDeleteOrganizationMutation,
  useUpdateOrganizationMutation
} from '@/features/organization/api/organizationApi'
import { useStatusTranslation } from '@/utils/index'

export function useGetOrganizationColumn(): ColumnDef<Organization>[] {
  const router = useRouter()
  const locale = useLocale()
  const { openModal } = useModal()
  const [deleteOrganization] = useDeleteOrganizationMutation()
  const [updateOrganizationStatus] = useUpdateOrganizationMutation()
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const statusTranslate = useStatusTranslation()
  const tm = useTranslations('message')

  const handleNavigatePacingGuide = (id: number) => {
    router.push(`/${locale}/admin/organization/${id}`)
  }

  const statusOptions = [
    { label: OrganizationStatus.ACTIVE, value: OrganizationStatus.ACTIVE },
    { label: OrganizationStatus.ARCHIVED, value: OrganizationStatus.ARCHIVED },
    { label: OrganizationStatus.INACTIVE, value: OrganizationStatus.INACTIVE }
  ]

  const handleStatusChange = (organization: Organization, newStatus: string) => {
    updateOrganizationStatus({ id: organization.id, body: { status: newStatus as OrganizationStatus } })
      .unwrap()
      .then(() => toast.success(tt('successMessage.updateNoTitle')))
  }

  const handleArchive = async (organization: Organization) => {
    await updateOrganizationStatus({ id: organization.id, body: { status: OrganizationStatus.ARCHIVED } }).unwrap()
    toast.success(tt('successMessage.updateNoTitle'))
  }
  const handleRestore = async (organization: Organization) => {
    await updateOrganizationStatus({ id: organization.id, body: { status: OrganizationStatus.ACTIVE } }).unwrap()
    toast.success(tt('successMessage.updateNoTitle'))
  }

  const handleDelete = async (id: number) => {
    await deleteOrganization(id).unwrap()
    toast.success(tt('successMessage.delete'))
  }

  return [
    createSelectColumn<Organization>(),
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
              <div className='text-muted flex h-full w-full items-center justify-center text-xs'>
                {tc('tableHeader.noImage')}
              </div>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: 'name',
      header: () => <div>{tc('tableHeader.name')}</div>,
      cell: ({ row }) => {
        const lessonId = row.original.id
        return (
          <div
            onClick={() => handleNavigatePacingGuide(lessonId)}
            className='cursor-pointer font-bold transition hover:opacity-80'
          >
            {row.original.name}
          </div>
        )
      },
      enableSorting: true
    },

    {
      accessorKey: 'code',
      header: () => <div>{tc('tableHeader.code')}</div>,
      cell: ({ row }) => {
        const value = row.original.code
        return <div>{value}</div>
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
    {
      accessorKey: 'status',
      header: () => <div>{tc('tableHeader.status')}</div>,
      cell: ({ row }) => {
        return (
          <SStatusDropdown
            value={row.original.status}
            options={statusOptions.filter((opt) => opt.value == row.original.status)}
            onChange={(newStatus) => handleStatusChange(row.original, newStatus)}
          />
        )
      }
    },
    createActionsColumnFromItems<Organization>([
      {
        label: tc('button.view'),
        onClick: ({ original }) => {
          router.push(`/${locale}/admin/organization/${original.id}`)
        }
      },
      {
        label: tc('button.restore'),
        hidden: ({ original }) => original.status !== OrganizationStatus.ARCHIVED,
        onClick: async ({ original }) => {
          openModal('confirm', {
            message: tt('confirmMessage.restore', { title: original.name }),
            onConfirm: () => handleRestore(original)
          })
        }
      },
      {
        label: tc('button.archive'),
        archive: true,
        hidden: ({ original }) => original.status === OrganizationStatus.ARCHIVED,
        onClick: async ({ original }) => {
          openModal('confirm', {
            message: tt('confirmMessage.archive', { title: original.name }),
            onConfirm: () => handleArchive(original)
          })
        }
      },
      {
        label: tc('button.delete'),
        danger: true,
        hidden: ({ original }) => original.status === OrganizationStatus.ARCHIVED,
        onClick: async ({ original }) => {
          openModal('confirm', {
            message: tt('confirmMessage.delete', { title: original.name }),
            onConfirm: () => handleDelete(original.id)
          })
        }
      }
    ])
  ]
}
