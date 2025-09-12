import { Lesson } from '@/features/resource/lesson/types/lesson.type'
import { Section } from '@/features/resource/section/types/section.type'
import PrintableSectionDetail from './PrintableSectionDetail'
import { ApiSuccessResponse } from '@/types/baseModel'
import { useTranslations } from 'next-intl'
import React from 'react'

type LessonPrintableContentProps = {
  lessonData?: ApiSuccessResponse<Lesson>
  sectionData?: Section[]
}

export default function LessonPrintableContent({ lessonData, sectionData }: LessonPrintableContentProps) {
  const td = useTranslations('LessonDetails')

  if (!lessonData || !lessonData.data) {
    return <p>Lesson data not available.</p>
  }

  const { title, description, duration, ageRangeLabel, topicNames, skillNames, standardNames } = lessonData.data

  return (
    <div className='prose max-w-none'>
      <h1 className='mb-4 text-3xl font-bold'>{title}</h1>
      <div className='mb-6 flex gap-x-6 border-y py-2 text-sm text-gray-600'>
        <span>
          <strong>{td('lesson.duration')}:</strong> {duration} {td('lesson.dur_unit')}
        </span>
        <span>
          <strong>{td('lesson.ageRange')}:</strong> {ageRangeLabel}
        </span>
      </div>

      <h2 className='text-xl font-semibold'>{td('lesson.about')}</h2>
      <p className='whitespace-pre-wrap'>{description}</p>

      <div className='my-4 flex flex-wrap gap-4'>
        {topicNames.length > 0 && (
          <div>
            <strong>{td('lesson.topic')}:</strong> {topicNames.join(', ')}
          </div>
        )}
        {skillNames.length > 0 && (
          <div>
            <strong>{td('lesson.skill')}:</strong> {skillNames.join(', ')}
          </div>
        )}
        {standardNames.length > 0 && (
          <div>
            <strong>{td('lesson.standard')}:</strong> {standardNames.join(', ')}
          </div>
        )}
      </div>

      <hr className='my-8' />

      <h2 className='text-xl font-semibold'>{td('sections')}</h2>
      {sectionData && sectionData.length > 0 ? (
        <div className='space-y-8'>
          {sectionData
            .slice()
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((sec, index) => (
              <div key={sec.id} className='page-break-before:always mt-6'>
                <h3 className='mb-4 border-b pb-2 text-lg font-bold text-gray-800'>
                  {index + 1}. {sec.description} ({sec.duration} mins)
                </h3>
                <PrintableSectionDetail sectionId={sec.id} />
              </div>
            ))}
        </div>
      ) : (
        <p>{td('notFound.no_section_v2')}</p>
      )}
    </div>
  )
}
