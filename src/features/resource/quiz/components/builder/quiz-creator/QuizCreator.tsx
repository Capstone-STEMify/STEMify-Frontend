'use client'

import { Button } from '@/components/shadcn/button'
import BackButton from '@/components/shared/button/BackButton'
import { useModal } from '@/providers/ModalProvider'
import z from 'zod'
import { useAppForm } from '@/components/shared/form/items'
import { useCreateQuizMutation } from '@/features/resource/quiz/api/quizApi'
import { toast } from 'sonner'
import { useParams } from 'next/navigation'

type QuizFormData = {
  title: string
  description: string
  totalMarks: number
  passingMarks: number
  durationDays: number
  timeLimitMinutes?: number
  // contentType: 'Quiz'
  // sectionId: number
}

const defaultQuizFormData: QuizFormData = {
  title: '',
  description: '',
  totalMarks: 0,
  passingMarks: 0,
  durationDays: 0,
  timeLimitMinutes: undefined
  // contentType: 'Quiz',
  // sectionId: 0
}

export default function QuizCreate() {
  const { openModal } = useModal()
  const { sectionId } = useParams()
  const quizSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    totalMarks: z.number().min(1, 'Total marks must be at least 1'),
    passingMarks: z.number().min(0, 'Passing marks must be at least 0'),
    durationDays: z.number().min(0, 'Duration must be at least 0 days'),
    timeLimitMinutes: z.number().min(1, 'Time limit must be at least 1 minute').optional()
  })

  const [createQuiz, { isLoading: isCreating }] = useCreateQuizMutation()

  const form = useAppForm({
    defaultValues: defaultQuizFormData,
    validators: { onChange: quizSchema },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        sectionId: Number(sectionId),
        contentType: 'Quiz'
      }

      await createQuiz(payload).unwrap()
      toast.success('Quiz created successfully')
    }
  })
  return (
    <form
      className='mx-auto px-10'
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      {/* Header */}
      <div className='my-5 flex items-center justify-between'>
        <BackButton />
        <h1 className='text-xl font-semibold'>Create new Quiz</h1>
        <div className='space-x-2'>
          <Button className='bg-blue-600 px-6 text-white hover:bg-blue-700' onClick={() => openModal('quizAI')}>
            Create with AI
          </Button>
          <form.AppForm>
            <form.SubmitButton loading={isCreating}>Create Quiz</form.SubmitButton>
          </form.AppForm>
        </div>
      </div>

      <div className='space-y-3'>
        <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
          <form.AppField
            name='title'
            children={(field) => <field.TextField label='Quiz Title' placeholder='Enter quiz title' />}
          />
          <form.AppField
            name='timeLimitMinutes'
            children={(field) => <field.TextField type='number' label='Time Limit (Minutes)' placeholder='e.g. 60' />}
          />
        </div>
        <form.AppField
          name='description'
          children={(field) => <field.TextAreaField label='Quiz Description' placeholder='Type description here...' />}
        />

        <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
          <form.AppField
            name='totalMarks'
            children={(field) => <field.TextField type='number' label='Total Marks' placeholder='e.g. 100' />}
          />

          <form.AppField
            name='passingMarks'
            children={(field) => <field.TextField type='number' label='Passing Marks' placeholder='e.g. 40' />}
          />
          <form.AppField
            name='durationDays'
            children={(field) => <field.TextField type='number' label='Duration (Days)' placeholder='e.g. 7' />}
          />
        </div>
      </div>
    </form>
  )
}
