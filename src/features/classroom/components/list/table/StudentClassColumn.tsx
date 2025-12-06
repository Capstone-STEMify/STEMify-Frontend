import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/shadcn/button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { MoreHorizontal, User, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

export type StudentClassItem = {
  id: string
  name: string
  email: string
  imageUrl?: string
}

type UseStudentClassColumnsProps = {
  onViewDetail: (student: StudentClassItem) => void;
  onRemoveStudent: (student: StudentClassItem) => void;
}

export const useStudentClassColumns = ({ 
  onViewDetail, 
  onRemoveStudent 
}: UseStudentClassColumnsProps): ColumnDef<StudentClassItem>[] => {

  const t = useTranslations('tableHeader')

  return [
    {
      accessorKey: 'imageUrl',
      header: t('image'),
      size: 60,
      cell: ({ row }) => (
        <div className="py-1">
          <Avatar className="h-9 w-9 border border-gray-200">
            <AvatarImage src={row.original.imageUrl} alt={row.original.name} />
            <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-xs">
              {row.original.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      )
    },
    {
      accessorKey: 'name',
      header: t('studentName'),
      cell: ({ row }) => <div className="font-medium text-gray-900">{row.original.name}</div>
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <div className="text-muted-foreground text-sm">{row.original.email}</div>
    },
    {
      id: 'actions',
      header: () => <div className="text-right">{t('action')}</div>,
      cell: ({ row }) => {
        const student = row.original
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-200">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                
                <DropdownMenuItem onClick={() => onViewDetail(student)} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" /> Xem hồ sơ
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={() => onRemoveStudent(student)} 
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Xóa khỏi lớp
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}