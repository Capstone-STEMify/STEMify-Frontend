import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { Input } from '@/components/shadcn/input'
import { Button } from '@/components/shadcn/button'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Search, Filter, Download } from 'lucide-react'
import { ClassroomStatistic, DashboardData } from '../../types/dashboard.type'
import { useTranslations } from 'next-intl'

// Define props interface
interface ClassroomStatisticTableProps {
  data: DashboardData
}

export function ClassroomStatisticTable({ data }: ClassroomStatisticTableProps) {
  const classrooms = data.classroomStatistics

  const t = useTranslations('dashboard.organization')
  const tc = useTranslations('common')

  return (
    <Card className='rounded-xl border-none bg-white pt-4 pb-8 shadow-md'>
      <CardHeader className='flex flex-col items-center justify-between gap-4 py-4 md:flex-row'>
        <CardTitle className='text-lg font-semibold'>{t('classroomStat.title')}</CardTitle>
        <div className='flex w-full items-center gap-2 md:w-auto'>
          <div className='relative w-full md:w-auto'>
            <Search className='text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4' />
            <Input type='search' placeholder='Search Classroom' className='pl-8' />
          </div>
          <Button variant='outline'>
            <Filter className='mr-2 h-4 w-4' /> {tc('button.filter')}
          </Button>
          <Button variant='outline'>
            <Download className='mr-2 h-4 w-4' /> {tc('button.export')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className='bg-gray-100'>
              <TableHead className='w-[50px]'>
                <Checkbox />
              </TableHead>
              <TableHead>{t('classroomStat.code')}</TableHead>
              <TableHead>{t('classroomStat.currTitle')}</TableHead>
              <TableHead>{t('classroomStat.name')}</TableHead>
              <TableHead>{t('passRate')}</TableHead>
              <TableHead>{t('score')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Map over classroomStatistics data */}
            {classrooms.length > 0 ? (
              classrooms.map((classroom: ClassroomStatistic) => (
                <TableRow key={classroom.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className='font-medium'>{classroom.curriculumCode}</TableCell>
                  <TableCell className='font-medium'>{classroom.curriculumTitle}</TableCell>
                  <TableCell>
                    <span className='font-medium'>{classroom.name}</span>
                  </TableCell>
                  <TableCell>{classroom.passRate}%</TableCell>
                  <TableCell>{classroom.averageScore}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className='py-4 text-center'>
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
