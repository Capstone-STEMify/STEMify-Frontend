import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/shadcn/dropdown-menu'
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react'
import { OrganizationUser } from '@/features/user/types/user.type'
import { useLocale, useTranslations } from 'next-intl'
import { formatDate } from '@/utils/index'

export type OrganizationUserTableItem = OrganizationUser & {
  id: string
}

const subRowClass = 'h-[32px] flex items-center'

const getRoleBadgeVariant = (licenseType: string) => {
  switch (licenseType.toLowerCase()) {
    case 'organizationadmin':
      return 'destructive'
    case 'teacher':
      return 'default'
    case 'student':
      return 'secondary'
    default:
      return 'outline'
  }
}

export const useOrganizationUserColumns = (): ColumnDef<OrganizationUserTableItem>[] => {
  const handleViewDetail = (user: OrganizationUserTableItem) => {
    console.log('View detail', user.id)
  }
  const handleUpdate = (user: OrganizationUserTableItem) => {
    console.log('Update', user.id)
  }
  const handleDelete = (user: OrganizationUserTableItem) => {
    console.log('Delete', user.id)
  }
  const locale = useLocale()
  const tc = useTranslations('common')

  return [
    {
      accessorKey: 'fullName',
      header: tc('tableHeader.user'),
      meta: { className: 'align-top py-3' },
      cell: ({ row }) => (
        <div className='flex min-h-[32px] flex-col justify-center'>
          <span className='leading-tight font-semibold text-gray-900'>{row.original.fullName}</span>
          <span className='text-muted-foreground text-xs leading-tight'>{row.original.email}</span>
        </div>
      )
    },
    {
      id: 'license',
      header: tc('tableHeader.license'),
      meta: { className: 'align-top py-3' },
      cell: ({ row }) => (
        <div className='flex flex-col gap-1'>
          {row.original.subscriptions.map((sub) => (
            <div key={sub.subscriptionOrderId} className={subRowClass}>
              <Badge variant={getRoleBadgeVariant(sub.licenseType)} className='whitespace-nowrap'>
                {tc(`accountType.${sub.licenseType.toLowerCase()}`)}
              </Badge>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'groupName',
      header: tc('tableHeader.groupName'),
      meta: { className: 'align-top py-3' },
      cell: ({ row }) => (
        <div className='flex flex-col gap-1'>
          {row.original.groupName ? (
            <span className='rounded border border-blue-100 bg-blue-50 px-2 py-1 font-mono text-xs font-medium text-blue-600'>
              {row.original.groupName}
            </span>
          ) : (
            <span className='text-muted-foreground text-sm italic'>-</span>
          )}
        </div>
      )
    },
    {
      id: 'isActive',
      header: tc('tableHeader.status'),
      meta: { className: 'align-top py-3' },
      cell: ({ row }) => (
        <div className='flex flex-col gap-1'>
          <div className={subRowClass}>
            <Badge variant={row.original.isActive ? 'success' : 'secondary'} className='whitespace-nowrap'>
              {row.original.isActive ? tc('status.active') : tc('status.inactive')}
            </Badge>
          </div>
        </div>
      )
    },
    {
      id: 'joinedAt',
      header: tc('tableHeader.joinedAt'),
      meta: { className: 'align-top py-3' },
      cell: ({ row }) => (
        <div className='flex flex-col gap-1'>
          <div className={`${subRowClass} justify-start`}>
            <span className='text-muted-foreground text-sm whitespace-nowrap'>
              {formatDate(row.original.joinedAt, { locale })}
            </span>
          </div>
        </div>
      )
    },
    {
      id: 'actions',
      header: () => <div className='text-right'>{tc('tableHeader.actions')}</div>,
      meta: { className: 'align-top py-3' },
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className={`${subRowClass} justify-end`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0 hover:bg-slate-200'>
                  <span className='sr-only'>{tc('tableHeader.menu')}</span>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>{tc('button.actions')}</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleViewDetail(user)}>
                  <Eye className='mr-2 h-4 w-4' /> {tc('button.view')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdate(user)}>
                  <Pencil className='mr-2 h-4 w-4' /> {tc('button.update')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDelete(user)}
                  className='text-red-600 focus:bg-red-50 focus:text-red-600'
                >
                  <Trash2 className='mr-2 h-4 w-4' /> {tc('button.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      }
    }
  ]
}
