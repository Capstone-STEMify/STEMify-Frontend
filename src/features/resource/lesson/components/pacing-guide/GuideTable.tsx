import React from 'react'
import { motion, Variants } from 'framer-motion'
import { Table, TableBody, TableHead, TableHeader, TableRow } from './GuideTableCustom'
import { itemVariants } from '@/utils/motion'
import { useTranslations } from 'next-intl'
import { useSearchSectionQuery } from '@/features/resource/section/api/sectionApi'
import { Button } from '@/components/shadcn/button'
import { Plus } from 'lucide-react'
import { DataTable } from '@/components/shared/data-table/data-table'
import useGetGuideColumn from '@/features/resource/lesson/components/pacing-guide/GuideColumn'
import { SectionQueryParams } from '@/features/resource/section/types/section.type'

interface SyllabusSection {
  section: string
  duration: string
  objectives: string
  instructions: string
}

type GuideTableProps = {
  lessonId: number
}

export default function GuideTable({ lessonId }: GuideTableProps) {
  const t = useTranslations('PacingGuide.table')
  const tc = useTranslations('common')

  const queryParams: SectionQueryParams = { lessonId, pageNumber: 1, pageSize: 50 }
  const { data: sectionData } = useSearchSectionQuery(queryParams, { skip: !lessonId })
  const columns = useGetGuideColumn()

  if (!sectionData) return null
  return (
    <div>
      <h2 className='text-center text-3xl'>{t('list.courseListTitle')}</h2>
      <Button
        className='bg-amber-custom-400 my-5'
        onClick={() => {
          // openModal('curriculumSelectCourseListModal', { curriculumId })
        }}
      >
        <Plus className='mr-1 h-4 w-4' />
        {tc('button.addSection')}
      </Button>
      <DataTable data={sectionData.data.items || []} columns={columns} enableRowSelection pagingData={sectionData} />
    </div>
  )
}
