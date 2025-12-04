import { useAppForm } from '@/components/shared/form/items'
import { useCreateAssignmentMutation } from '@/features/assignment/api/assignmentApi'
import { useLocale, useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'
import z from 'zod'

type AssignmentFormData = {
  title: string
  passingScore: number
  durationDays: number
  cooldownHours: number
}

const defaultAssignmentData: AssignmentFormData = {
  title: 'Bài thực hành',
  passingScore: 100,
  durationDays: 7,
  cooldownHours: 1
}

type CreateAssignmentInfoProps = {
  sectionId: number
  closeModal?: () => void
}

export default function CreateAssignmentInfo({ sectionId, closeModal }: CreateAssignmentInfoProps) {
  const router = useRouter()
  const locale = useLocale()
  const { lessonId } = useParams()

  const tt = useTranslations('toast')
  const tc = useTranslations('common')
  const tv = useTranslations('validation')
  const ta = useTranslations('assignment')

  const assignmentSchema = z.object({
    title: z.string().min(1, tv('assignment.title', { length: 1 })),
    passingScore: z.number().min(0, tv('assignment.passingScore')),
    durationDays: z.number().min(1, tv('assignment.durationDays')),
    cooldownHours: z.number().min(0, tv('assignment.cooldownHours'))
  })

  const [createAssignment] = useCreateAssignmentMutation()

  const form = useAppForm({
    defaultValues: defaultAssignmentData,
    validators: { onChange: assignmentSchema },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        sectionId: Number(sectionId),
        questions: []
      }
      const res = await createAssignment(payload).unwrap()
      toast.success(tt('successMessage.create', { title: res.data.title }))
      closeModal?.()
      router.push(`/${locale}/admin/lesson/${lessonId}/section/${sectionId}/assignment/${res.data.id}`)
    }
  })
  return (
    <form
      className='w-3xl space-y-8 md:px-4'
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <div className='space-y-6'>
        <form.AppField
          name='title'
          children={(field) => (
            <field.TextField label={ta('upsert.title')} placeholder={ta('upsert.titlePlaceholder')} />
          )}
        />

        <div className='grid grid-cols-2 gap-6'>
          <form.AppField
            name='passingScore'
            
            children={(field) => <field.TextField type='number' min={0} max={100} label={ta('upsert.passingScore')} />}
          />

          <form.AppField
            name='durationDays'
            children={(field) => <field.TextField type='number' min={1} label={ta('upsert.durationDays')} />}
          />

          <form.AppField
            name='cooldownHours'
            children={(field) => <field.TextField type='number' min={0} label={ta('upsert.cooldownHours')} />}
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
