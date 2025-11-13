import { useGetAssignmentByIdQuery } from '../../api/assignmentApi'
import { Content } from '../../../resource/content/types/content.type'
import LoadingComponent from '../../../../components/shared/loading/LoadingComponent'
import { FileText, Paperclip } from 'lucide-react'
import React from 'react'

type AssignmentViewerProps = {
  item: Content & { assignmentId: number }
}

export default function AssignmentViewer({ item }: AssignmentViewerProps) {

  const {
    data: assignmentData,
    isLoading,
    isError
  } = useGetAssignmentByIdQuery(item.assignmentId, {
    skip: !item.assignmentId
  })

  if (isLoading) {
    return (
      <div className='flex h-60 items-center justify-center'>
        <LoadingComponent size={80} />
      </div>
    )
  }

  if (isError || !assignmentData || !assignmentData.data) {
    return <div className='text-center text-red-500'>Error loading assignment data.</div>
  }

  const assignment = assignmentData.data

  const getUnit = (unit: string, count: number) => {
    return count === 1 ? unit : `${unit}s`
  }

  const pointsUnit = (count: number) => getUnit('point', count)
  const daysUnit = (count: number) => getUnit('day', count)

  return (
    <div className='p-4'>
      <h2 className='mb-6 text-2xl font-bold text-gray-800'>{assignment.title}</h2>

      <div className='mb-8 grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 sm:grid-cols-3'>
        <InfoCard title='Total Score' value={assignment.totalScore} />
        <InfoCard title='Passing Score' value={assignment.passingScore} />
        <InfoCard
          title='Duration'
          value={`${assignment.durationDays} ${daysUnit(assignment.durationDays)}`}
        />
      </div>

      <div>
        <h3 className='mb-4 text-xl font-semibold text-gray-700'>Questions</h3>
        <div className='space-y-6'>
          {assignment.questions.map((question, index) => (
            <div key={question.id} className='overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm flex'>
              <div className='w-1/2 p-5'>
                <div className='mb-3 flex flex-wrap items-center justify-between gap-2'>
                  <span className='text-lg font-semibold text-gray-900'>
                    Question {index + 1}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium ${
                      question.type === 'Text'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {question.type === 'Text' ? (
                      <FileText size={16} className='mr-1.5' />
                    ) : (
                      <Paperclip size={16} className='mr-1.5' />
                    )}
                    {question.type}
                  </span>
                </div>

                <p className='mb-4 text-base text-gray-700'>{question.content}</p>
                <div className='text-sm font-medium text-gray-600'>
                  {question.points} {pointsUnit(question.points)}
                </div>
              </div>

              {/* Rubric Criteria */}
              {question.rubricCriterion && question.rubricCriterion.length > 0 && (
                <div className='border-t border-gray-200 bg-gray-50 px-5 py-4 w-1/2'>
                  <h5 className='mb-2 text-sm font-semibold text-gray-600'>Rubric</h5>
                  <ul className='list-inside list-disc space-y-1 pl-2'>
                    {question.rubricCriterion.map((criterion) => (
                      <li key={criterion.id} className='text-sm text-gray-600'>
                        {criterion.criterionName} <span className='italic'>(max: {criterion.maxPoints} {pointsUnit(criterion.maxPoints)})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const InfoCard = ({ title, value }: { title: string; value: string | number }) => (
  <div className='rounded-md bg-white p-4 text-center shadow-sm'>
    <h4 className='mb-1 text-sm font-medium uppercase text-gray-500'>{title}</h4>
    <p className='text-xl font-semibold text-gray-900'>{value}</p>
  </div>
)