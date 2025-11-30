import { useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { DataTable } from '@/components/shared/data-table/data-table'
import StudentColumn from '@/features/group/components/upsert/StudentColumn'
import { useTranslations } from 'next-intl'

type Student = {
  id: string
  name: string
  email: string
  avatar: string
}

const MOCK_STUDENTS: Student[] = [
  { id: '1', name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', avatar: '' },
  { id: '2', name: 'Trần Thị B', email: 'tranthib@example.com', avatar: '' },
  { id: '3', name: 'Lê Văn C', email: 'levanc@example.com', avatar: '' },
  { id: '4', name: 'Phạm Thị D', email: 'phamthid@example.com', avatar: '' },
  { id: '5', name: 'Hoàng Văn E', email: 'hoangvane@example.com', avatar: '' },
  { id: '6', name: 'Vũ Thị F', email: 'vuthif@example.com', avatar: '' },
  { id: '7', name: 'Đặng Văn G', email: 'dangvang@example.com', avatar: '' },
  { id: '8', name: 'Bùi Thị H', email: 'buithih@example.com', avatar: '' },
  { id: '9', name: 'Đỗ Văn I', email: 'dovani@example.com', avatar: '' },
  { id: '10', name: 'Ngô Thị K', email: 'ngothik@example.com', avatar: '' }
]

interface Step1SelectStudentGroupProps {
  onNext: (data: { numberOfStudents: number; gradeLevel: number; selectedStudentIds: string[] }) => void
}

export default function Step1SelectStudentGroup({ onNext }: Step1SelectStudentGroupProps) {
  const to = useTranslations('organization.group')
  const tc = useTranslations('common')

  const [numberOfStudents, setNumberOfStudents] = useState<string>('')
  const [gradeLevel, setGradeLevel] = useState<string>('')
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([])

  const columns = StudentColumn()

  const handleNext = () => {
    if (!numberOfStudents || !gradeLevel || selectedStudentIds.length === 0) {
      alert('Vui lòng điền đầy đủ thông tin và chọn ít nhất 1 học sinh')
      return
    }

    const numStudents = parseInt(numberOfStudents)
    if (numStudents <= 0) {
      alert('Số học sinh trong 1 group phải lớn hơn 0')
      return
    }

    onNext({
      numberOfStudents: numStudents,
      gradeLevel: parseInt(gradeLevel),
      selectedStudentIds
    })
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='mb-4 text-2xl font-bold'>{to('step1.title')}</h2>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='numberOfStudents'>{to('step1.description')}</Label>
          <Input
            id='numberOfStudents'
            type='number'
            min='1'
            placeholder={to('step1.numberOfStudents')}
            value={numberOfStudents}
            onChange={(e) => setNumberOfStudents(e.target.value)}
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='gradeLevel'>{to('step1.gradeLevel')}</Label>
          <Select value={gradeLevel} onValueChange={setGradeLevel}>
            <SelectTrigger id='gradeLevel'>
              <SelectValue placeholder={to('step1.gradeLevelPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='1'>Level 1</SelectItem>
              <SelectItem value='2'>Level 2</SelectItem>
              <SelectItem value='3'>Level 3</SelectItem>
              <SelectItem value='4'>Level 4</SelectItem>
              <SelectItem value='5'>Level 5</SelectItem>
              <SelectItem value='6'>Level 6</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <Label>{to('step1.studentList')}</Label>
          <span className='text-muted-foreground text-sm'>
            {to('step1.selected')}: {selectedStudentIds.length}/{MOCK_STUDENTS.length}
          </span>
        </div>

        <DataTable
          data={MOCK_STUDENTS}
          columns={columns}
          enableRowSelection
          onSelectionChange={(ids) => setSelectedStudentIds(ids.map(String))}
        />
      </div>

      <div className='flex justify-end'>
        <Button onClick={handleNext}>{tc('button.next')}</Button>
      </div>
    </div>
  )
}
