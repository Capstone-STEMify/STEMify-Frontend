import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react'
import { OrganizationUser } from '@/features/user/types/user.type'

export type OrganizationUserTableItem = OrganizationUser & {
  id: string 
}

const subRowClass = "h-[32px] flex items-center"

const getRoleBadgeVariant = (role: string) => {
  switch (role.toLowerCase()) {
    case 'organizationadmin': return 'destructive'
    case 'teacher': return 'default'
    case 'student': return 'secondary'
    default: return 'outline'
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('vi-VN')
}

export const useOrganizationUserColumns = (): ColumnDef<OrganizationUserTableItem>[] => {

  const handleViewDetail = (user: OrganizationUserTableItem) => {
    console.log("View detail", user.id)
  }
  const handleUpdate = (user: OrganizationUserTableItem) => {
    console.log("Update", user.id)
  }
  const handleDelete = (user: OrganizationUserTableItem) => {
    console.log("Delete", user.id)
  }

  return [
    {
      accessorKey: 'fullName',
      header: 'Người dùng',
      meta: { className: 'align-top py-3' },
      cell: ({ row }) => (
        <div className="flex flex-col justify-center min-h-[32px]">
          <span className="font-semibold text-gray-900 leading-tight">{row.original.fullName}</span>
          <span className="text-muted-foreground text-xs leading-tight">{row.original.email}</span>
        </div>
      )
    },
    {
      id: 'role',
      header: 'Vai trò',
      meta: { className: 'align-top py-3' },
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          {row.original.subscriptions.map((sub) => (
            <div key={sub.organizationUserId} className={subRowClass}>
              <Badge variant={getRoleBadgeVariant(sub.organizationRole)} className="whitespace-nowrap">
                {sub.organizationRole}
              </Badge>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'classId',
      header: 'Lớp học',
      meta: { className: 'align-top py-3' },
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          {row.original.subscriptions.map((sub) => (
            <div key={sub.organizationUserId} className={subRowClass}>
              {sub.classId ? (
                <span className="font-mono text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                  {sub.classId}
                </span>
              ) : (
                <span className="text-muted-foreground text-sm italic">-</span>
              )}
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'license',
      header: 'License',
      meta: { className: 'align-top py-3' },
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          {row.original.subscriptions.map((sub) => (
            <div key={sub.organizationUserId} className={subRowClass}>
              <span className="text-sm text-gray-700">{sub.licenseType}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'joinedAt',
      header: 'Ngày tham gia',
      meta: { className: 'align-top py-3' },
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          {row.original.subscriptions.map((sub) => (
            <div key={sub.organizationUserId} className={`${subRowClass} justify-start`}>
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {formatDate(sub.joinedAt)}
              </span>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Action</div>,
      meta: { className: 'align-top py-3' },
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className={`${subRowClass} justify-end`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-200">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleViewDetail(user)}>
                  <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdate(user)}>
                  <Pencil className="mr-2 h-4 w-4" /> Cập nhật
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => handleDelete(user)} 
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Xóa người dùng
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}