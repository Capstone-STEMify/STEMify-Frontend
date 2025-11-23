'use client'

import React, { useEffect, useState } from 'react'
import { DataTable } from '@/components/shared/data-table/data-table'
import SearchBar from '@/components/shared/search/SearchBar'
import { useDebounce } from '@/components/shadcn/multiselect'
import { setSearchTerm } from '@/features/user/slice/userSlice'
import { useAppDispatch } from '@/hooks/redux-hooks'
import { Input } from '@/components/shadcn/input'
import { se } from 'date-fns/locale'
import { useTranslations } from 'next-intl'

type ClassroomAssignSectionProps = {
  form: any
  curriculumOptions: any[]
  teacherOptions: any[]
  columns: any[]
  rows: any[]
  selectedStudentIds: string[]
  studentData: any
  searchUserQuery: any
  handlePageChange: (newPage: number) => void
  setSelectedStudentIds: (ids: string[]) => void
}

export default function ClassroomAssignSection({
  form,
  curriculumOptions,
  teacherOptions,
  columns,
  rows,
  selectedStudentIds,
  studentData,
  searchUserQuery,
  handlePageChange,
  setSelectedStudentIds
}: ClassroomAssignSectionProps) {
  const tClassroom = useTranslations('classroom.create.step2')

  const [search, setSearch] = useState<string>('')
  const debouncedSearchQuery = useDebounce(search, 500)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setSearchTerm(debouncedSearchQuery))
  }, [debouncedSearchQuery, dispatch])

  return (
    <div className='animate-fadeIn mx-auto max-w-6xl space-y-6'>
      {/* Curriculum & Teacher Section */}
      <div className='rounded-lg border bg-white p-6 shadow-sm'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900'>{tClassroom('curriculumAndTeacher')}</h3>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <form.AppField
            name='curriculumId'
            children={(field: any) => (
              <field.SingleSelectWithSearch
                value={form.getFieldValue('curriculumId')?.toString()}
                options={curriculumOptions}
                label={tClassroom('curriculum')}
                placeholder={tClassroom('chooseCurriculum')}
                onChange={(val: any) => form.setFieldValue('curriculumId', Number(val))}
              />
            )}
          />

          <form.AppField
            name='teacherId'
            children={(field: any) => (
              <field.SingleSelectWithSearch
                value={form.getFieldValue('teacherId')}
                options={teacherOptions}
                label={tClassroom('teacher')}
                placeholder={tClassroom('chooseTeacher')}
                onChange={(val: any) => form.setFieldValue('teacherId', val)}
              />
            )}
          />
        </div>
      </div>

      {/* Students Section */}
      <div className='rounded-lg border bg-white p-6 shadow-sm'>
        <div className='mb-4 flex items-center justify-between'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>{tClassroom('students')}</h3>
            <p className='mt-1 text-sm text-gray-500'>{tClassroom('selectStudents')}</p>
          </div>
          <div className='text-sm text-gray-600'>
            <span className='font-medium'>{selectedStudentIds.length}</span> {tClassroom('selected')}
          </div>
        </div>
        <Input
          type='text'
          placeholder={tClassroom('searchStudent')}
          className='mb-4 w-[350px]'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Student Table */}
        <div className='overflow-hidden py-4'>
          <DataTable
            data={rows as any}
            columns={columns as any}
            enableRowSelection
            pagingData={studentData}
            pagingParams={searchUserQuery}
            handlePageChange={handlePageChange}
            rowSelection={selectedStudentIds}
            onSelectionChange={(userId) => {
              setSelectedStudentIds(userId.map((id) => id.toString()))
            }}
          />
        </div>
      </div>
    </div>
  )
}
