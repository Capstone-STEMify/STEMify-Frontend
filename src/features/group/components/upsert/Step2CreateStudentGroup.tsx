import { useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { useTranslations } from 'next-intl'

interface Group {
  groupName: string
  studentIds: string[]
}

interface Step2CreateStudentGroupProps {
  numberOfStudents: number
  gradeLevel: number
  selectedStudentIds: string[]
  onBack?: () => void
}

export default function Step2CreateStudentGroup({
  numberOfStudents,
  gradeLevel,
  selectedStudentIds,
  onBack
}: Step2CreateStudentGroupProps) {
  const to = useTranslations('organization.group')
  const tc = useTranslations('common')
  // Tính số lượng groups
  const numberOfGroups = Math.ceil(selectedStudentIds.length / numberOfStudents)

  // Chia students vào các groups
  const distributeStudents = () => {
    const groups: string[][] = []
    for (let i = 0; i < numberOfGroups; i++) {
      groups.push([])
    }

    selectedStudentIds.forEach((studentId, index) => {
      const groupIndex = index % numberOfGroups
      groups[groupIndex].push(studentId)
    })

    return groups
  }

  const distributedGroups = distributeStudents()

  // State để lưu tên của mỗi group
  const [groupNames, setGroupNames] = useState<string[]>(
    Array(numberOfGroups)
      .fill('')
      .map((_, i) => `Group ${i + 1}`)
  )

  const handleGroupNameChange = (index: number, value: string) => {
    const newGroupNames = [...groupNames]
    newGroupNames[index] = value
    setGroupNames(newGroupNames)
  }

  const handleCreate = () => {
    // Validate: kiểm tra tất cả groups đều có tên
    const hasEmptyName = groupNames.some((name) => name.trim() === '')
    if (hasEmptyName) {
      alert('Vui lòng nhập tên cho tất cả các groups')
      return
    }

    // Tạo mảng kết quả
    const result: Group[] = groupNames.map((groupName, index) => ({
      groupName: groupName.trim(),
      studentIds: distributedGroups[index]
    }))

    // Console log kết quả
    console.log('=== CREATE STUDENT GROUPS ===')
    console.log('Grade Level:', gradeLevel)
    console.log('Groups:', JSON.stringify(result, null, 2))
    console.log('===========================')

    // Có thể thêm logic gọi API ở đây
    alert('Đã tạo groups thành công! Kiểm tra console để xem kết quả.')
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='mb-2 text-2xl font-bold'>{to('step2.title')}</h2>
        <p className='text-muted-foreground'>
          {to('step2.numberOfStudents')}: {selectedStudentIds.length} | {to('step2.studentsPerGroup')}:{' '}
          {numberOfStudents} | {to('step2.gradeLevel')}: {gradeLevel}
        </p>
      </div>

      <div className='space-y-3'>
        <Label>
          {to('step2.groupList')} ({numberOfGroups})
        </Label>

        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          {distributedGroups.map((studentIds, index) => (
            <div key={index} className='bg-card flex items-center gap-4 rounded-lg border p-4'>
              <div className='flex-1'>
                <Label htmlFor={`group-${index}`} className='mb-2 text-sm'>
                  {to('step2.name')} {index + 1}
                </Label>
                <Input
                  id={`group-${index}`}
                  placeholder={`${to('step2.name')} ${index + 1}`}
                  value={groupNames[index]}
                  onChange={(e) => handleGroupNameChange(index, e.target.value)}
                />
              </div>

              <div className='flex h-full min-w-[120px] items-center justify-center'>
                <div className='text-center'>
                  <div className='text-muted-foreground text-sm'>{to('step2.studentCount')}</div>
                  <div className='text-2xl font-bold'>{studentIds.length}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='flex justify-between'>
        {onBack && (
          <Button variant='outline' onClick={onBack}>
            {tc('button.back')}
          </Button>
        )}
        <Button onClick={handleCreate} className='ml-auto'>
          {tc('button.create')}
        </Button>
      </div>
    </div>
  )
}
