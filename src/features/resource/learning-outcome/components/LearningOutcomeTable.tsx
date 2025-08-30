'use client'

import { Button } from '@/components/shadcn/button'
import { Card } from '@/components/shadcn/card'
import { Plus } from 'lucide-react'
import { useSearchLearningOutcomeQuery } from '../api/learningOutcomeApi'
import { LearningOutcomeQueryParams } from '../types/learningOutcome.type'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'

export default function LearningOutcomeTable({ curriculumId }: { curriculumId?: number }) {
  const t = useTranslations('table')
  const queryParams: LearningOutcomeQueryParams = {
    curriculumId
  }
  const { data: learningOutcomes, isLoading } = useSearchLearningOutcomeQuery(queryParams)

  if (isLoading) {
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  }

  return (
    <div className='mx-auto my-10 w-full max-w-7xl space-y-4 rounded-lg border bg-blue-50 p-4 shadow-sm'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2 text-lg font-semibold'>
          <label htmlFor='select-backlog' className='cursor-default'>
            Curriculum Learning Outcomes
          </label>
          <span className='rounded bg-green-200 px-2 text-sm'>0</span>
        </div>
      </div>

      {/* Empty learning outcomes */}
      {isLoading || !learningOutcomes || learningOutcomes?.data.items.length === 0 ? (
        <Card className='border-2 border-dashed border-gray-300 py-10 text-center text-sm text-gray-500'>
          Curriculum learning outcomes is empty.
        </Card>
      ) : (
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='bg-yellow-100'>
                <TableHead className='py-4 text-center font-bold text-gray-800'>{t('name')}</TableHead>
                <TableHead className='py-4 text-center font-bold text-gray-800'>{t('description')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {learningOutcomes?.data.items.map((row, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-muted/50 border-b transition-colors`}
                >
                  <td className='px-4 py-6 align-top font-medium text-gray-800'>{row.name}</td>
                  <td className='max-w-md px-4 py-6 align-top'>
                    <p className='leading-relaxed text-gray-700'>{row.description}</p>
                  </td>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create learning outcome */}
      <Button size='sm' className='bg-amber-400 text-sm'>
        <Plus className='mr-1 h-4 w-4' />
        Add
      </Button>
    </div>
  )
}
