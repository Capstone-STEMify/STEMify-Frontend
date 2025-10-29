import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { Progress } from '@/components/shadcn/progress'
import { ColumnDef } from '@tanstack/react-table'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'

type Classroom = {
  id: number
  title: string
  students: string[]
  category: string
  duration: string
  status: 'In progress' | 'Completed' | 'Pending'
  completedTasks: number
  totalTasks: number
}
export function useGetClassroomColumn(): ColumnDef<Classroom>[] {
  return [
    {
      accessorKey: 'title',
      header: 'Class title',
      cell: ({ row }) => <span className='text-foreground font-medium'>{row.original.title}</span>
    },
  {
    accessorKey: 'students',
    header: 'Student',
    cell: ({ row }) => (
      <div className='flex -space-x-2'>
        {row.original.students.map((src, i) => (
          <Image
            key={i}
            src={src}
            alt='student avatar'
            width={28}
            height={28}
            className='border-background h-7 w-7 rounded-full border-2 object-cover'
          />
        ))}
      </div>
    )
  },
  {
    accessorKey: 'category',
    header: 'Category'
  },
  {
    accessorKey: 'duration',
    header: 'Duration'
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      const badgeColor =
        status === 'Completed'
          ? 'bg-emerald-100 text-emerald-700'
          : status === 'In progress'
            ? 'bg-orange-100 text-orange-700'
            : 'bg-yellow-100 text-yellow-700'
      return <Badge className={`${badgeColor} font-medium`}>{status}</Badge>
    }
  },
  {
    id: 'completion',
    header: 'Completion rate',
    cell: ({ row }) => {
      const { completedTasks, totalTasks } = row.original
      const percent = Math.round((completedTasks / totalTasks) * 100)
      return (
        <div className='w-[180px]'>
          <div className='text-muted-foreground flex justify-between text-xs'>
            <span>
              {completedTasks}/{totalTasks} Completed
            </span>
            <span>{percent}%</span>
          </div>
          <Progress value={percent} className='mt-1 h-2' />
        </div>
      )
    }
  },
  {
    id: 'action',
    header: 'Action',
    cell: () => (
      <Button variant='outline' size='sm' className='flex items-center gap-1'>
        Action <ChevronDown className='h-4 w-4' />
      </Button>
    )
  }
]
}
