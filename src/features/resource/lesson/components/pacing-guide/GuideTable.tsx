import React from 'react'
import { motion, Variants } from 'framer-motion'
import { Table, TableBody, TableHead, TableHeader, TableRow } from './GuideTableCustom'
import { itemVariants } from '@/utils/motion'
import { useTranslations } from 'next-intl'
import { useSearchSectionQuery } from '@/features/resource/section/api/sectionApi'

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
  const { data } = useSearchSectionQuery({ lessonId }, { skip: !lessonId })

  const t = useTranslations('PacingGuide.table')

  if (!data) return null
  return (
    <motion.div className='overflow-hidden rounded-lg border bg-white shadow-sm' variants={itemVariants}>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='bg-yellow-100'>
              <TableHead className='py-4 text-center font-bold text-gray-800'>{t('section')}</TableHead>
              <TableHead className='py-4 text-center font-bold text-gray-800'>{t('duration')}</TableHead>
              <TableHead className='py-4 text-center font-bold text-gray-800'>{t('description')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.items.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-muted/50 border-b transition-colors`}
              >
                <td className='px-4 py-6 align-top font-medium text-gray-800'>{row.title}</td>
                <td className='px-4 py-6 align-top font-mono'>{row.duration} mins</td>
                <td className='max-w-md px-4 py-6 align-top'>
                  <p className='leading-relaxed text-gray-700'>{row.description}</p>
                </td>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  )
}
