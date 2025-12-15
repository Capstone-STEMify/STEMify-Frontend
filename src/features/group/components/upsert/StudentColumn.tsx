import { Avatar, AvatarFallback } from '@/components/shadcn/avatar'
import { createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { OrganizationUser } from '@/features/user/types/user.type'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

export default function StudentColumn(): ColumnDef<OrganizationUser>[] {
  const tc = useTranslations('common')

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  return [
    createSelectColumn<OrganizationUser>(),
    {
      accessorKey: 'imageUrl',
      header: tc('tableHeader.image'),
      cell: ({ row }) => {
        const student = row.original
        return (
          <div className='flex items-center gap-3'>
            <Avatar className='h-10 w-10'>
              <AvatarFallback className='bg-primary/10 text-primary font-semibold'>
                {getInitials(student.fullName)}
              </AvatarFallback>
            </Avatar>
          </div>
        )
      }
    },
    {
      accessorKey: 'fullName',
      header: tc('tableHeader.name')
    },
    {
      accessorKey: 'email',
      header: tc('tableHeader.email')
    }
  ]
}
