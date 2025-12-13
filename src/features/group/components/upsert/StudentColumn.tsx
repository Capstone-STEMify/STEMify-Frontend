import { createSelectColumn } from '@/components/shared/data-table/columns-helpers'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

type Student = {
  id: string
  name: string
  email: string
  avatar: string
}

export default function StudentColumn(): ColumnDef<Student>[] {
  const to = useTranslations('common.tableHeader')
  return [
    createSelectColumn<Student>(),
    {
      accessorKey: 'id',
      header: 'ID'
    },
    {
      accessorKey: 'name',
      header: to('name')
    },
    {
      accessorKey: 'email',
      header: to('email')
    }
  ]
}
