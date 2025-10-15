'use client'
import { createActionsColumnFromItems, createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { useTranslations } from 'next-intl'
import { useModal } from '@/providers/ModalProvider'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/shadcn/badge'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { Organization, OrganizationStatus } from '@/features/organization/types/organization.type'
import Image from 'next/image'
import { toast } from 'sonner'

export function useGetOrganizationColumnTable(): ColumnDef<Organization>[] {
  const { openModal } = useModal()
  const tm = useTranslations('message')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')

  const handleDelete = async (id: number) => {
    try {
      //   await deleteAgeRange(id).unwrap()
      toast.success(`${tt('successMessage.delete', { title: id || '' })}`)
    } catch (error) {
      toast.error(tt('errorMessage'))
    }
  }

  return [
    createSelectColumn<Organization>(),
    {
      accessorKey: 'imageUrl',
      header: tc('tableHeader.image'),
      cell: ({ row }) => {
        const src = row.getValue<string>('imageUrl')
        return (
          <div className='h-14 w-14 overflow-hidden rounded-full'>
            {src ? (
              <Image
                src={src}
                alt='preview'
                className='h-full w-full rounded-full object-cover'
                width={56}
                height={56}
              />
            ) : (
              <div className='text-muted flex h-full w-full items-center justify-center text-xs'>{tc('noImage')}</div>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: 'name',
      header: tc('tableHeader.name')
    },
    {
      accessorKey: 'organizationType',
      header: tc('tableHeader.organizationType')
    },
    {
      accessorKey: 'createdAt',
      header: tc('tableHeader.createdAt')
    },
    {
      accessorKey: 'status',
      header: tc('tableHeader.status'),
      cell: ({ row }) => {
        const value = row.getValue<OrganizationStatus>('status')
        const badgeValue = value.toLocaleUpperCase() as OrganizationStatus
        return <Badge className={`${getStatusBadgeClass(badgeValue)}`}>{value}</Badge>
      }
    },
    createActionsColumnFromItems<Organization>([
      {
        label: tc('button.view'),
        onClick: ({ original }) => {
          //   openModal('organizationDetail', { id: original.id })
        }
      },
      {
        label: tc('button.update'),
        onClick: ({ original }) => {
          openModal('upsertOrganization', { id: original.id })
        }
      },
      {
        label: tc('button.delete'),
        danger: true,
        onClick: async ({ original }) => {
          openModal('confirm', {
            message: `${tt('confirmMessage.delete', { title: original.name })}`,
            onConfirm: () => handleDelete(original.id)
          })
        }
      }
    ])
  ]
}
