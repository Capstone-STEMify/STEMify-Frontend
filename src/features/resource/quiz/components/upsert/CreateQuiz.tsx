import { useAppForm } from '@/components/shared/form/items'
import { QuizContent } from '@/features/resource/content/types/content.type'
import { useCreateQuizMutation } from '@/features/resource/quiz/api/quizApi'
import { useLocale, useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'
import z from 'zod'

type CreateQuizProps = {
  sectionId: number
  closeModal?: () => void
}
type QuizFormData = {
  title: string
  description: string
  totalMarks: number
  passingMarks: number
  durationDays: number
  timeLimitMinutes?: number // optional
  cooldownHours?: number // optional
}

const defaultQuizData: QuizFormData = {
  title: 'Bài quiz',
  description: '',
  totalMarks: 100,
  passingMarks: 70,
  durationDays: 7,
  timeLimitMinutes: 30,
  cooldownHours: 1
}

export default function CreateQuiz({ sectionId, closeModal }: CreateQuizProps) {
  const router = useRouter()
  const locale = useLocale()
  const { lessonId } = useParams()

  const tt = useTranslations('toast')
  const tc = useTranslations('common')
  const tv = useTranslations('validation')
  const tq = useTranslations('quiz.upsert.form')

  const quizSchema = z.object({
    title: z.string().min(1, tv('quiz.title', { length: 1 })),
    description: z.string().min(1, tv('quiz.description', { length: 1 })),
    totalMarks: z.number().min(1, tv('quiz.totalMarks')),
    passingMarks: z.number().min(0, tv('quiz.passingMarks')),
    durationDays: z.number().min(1, tv('quiz.durationDays')),
    timeLimitMinutes: z.number().min(0, tv('quiz.timeLimitMinutes')).optional(),
    cooldownHours: z.number().min(0, tv('quiz.cooldownHours')).optional()
  })

  const [createQuiz] = useCreateQuizMutation()

  const form = useAppForm({
    defaultValues: defaultQuizData,
    validators: { onChange: quizSchema },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        sectionId: Number(sectionId),
        content: [] as QuizContent[]
      }
      const res = await createQuiz(payload).unwrap()
      toast.success(tt('successMessage.create', { title: res.data.title }))
      closeModal?.()
      router.push(`/${locale}/admin/lesson/${lessonId}/section/${sectionId}/quiz/${res.data.id}`)
    }
  })

  return (
    <form
      className='w-3xl space-y-8'
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <div className='space-y-6'>
        {/* Title */}
        <form.AppField
          name='title'
          children={(field) => <field.TextField label={tq('title')} placeholder={tq('titlePlaceholder')} />}
        />
        {/* Description */}
        <form.AppField
          name='description'
          children={(field) => (
            <field.TextAreaField label={tq('description')} placeholder={tq('descriptionPlaceholder')} />
          )}
        />

        <div className='grid grid-cols-1 gap-5 lg:grid-cols-3'>
          <form.AppField
            name='totalMarks'
            children={(field) => <field.TextField type='number' min={1} label={tq('totalMarks')} />}
          />

          <form.AppField
            name='passingMarks'
            children={(field) => <field.TextField type='number' min={0} label={tq('passingMarks')} />}
          />

          <form.AppField
            name='durationDays'
            children={(field) => <field.TextField type='number' min={1} label={tq('durationDays')} />}
          />

          <form.AppField
            name='timeLimitMinutes'
            children={(field) => <field.TextField type='number' min={0} label={tq('timeLimitMinutes')} />}
          />

          <form.AppField
            name='cooldownHours'
            children={(field) => <field.TextField type='number' min={0} label={tq('cooldownHours')} />}
          />
        </div>

        <div className='flex justify-end'>
          <form.AppForm>
            <form.SubmitButton className='bg-amber-custom-400 py-3 text-lg'>{tc('button.save')}</form.SubmitButton>
          </form.AppForm>
        </div>
      </div>
    </form>
  )
}
