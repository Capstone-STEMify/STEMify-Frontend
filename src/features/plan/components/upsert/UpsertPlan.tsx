import { useAppForm } from '@/components/shared/form/items'
import { useCreatePlanMutation, useGetPlanByIdQuery, useUpdatePlanMutation } from '@/features/plan/api/planApi'
import { useModal } from '@/providers/ModalProvider'
import React, { useEffect } from 'react'
import { toast } from 'sonner'
import z from 'zod'

type PlanFormData = {
  name: string
  description: string
  accessSupportDetail: string
  maxTeacherSeats: number
  maxStudentSeats: number
  isAddOn: boolean
  curriculumIds: number[]
}

const defaultPlanFormData: PlanFormData = {
  name: '',
  description: '',
  accessSupportDetail: '',
  maxTeacherSeats: 100,
  maxStudentSeats: 10,
  isAddOn: false,
  curriculumIds: []
}

type UpsertPlanProps = {
  planId?: number
  onSuccess?: () => void
}

export default function UpsertPlan({ planId, onSuccess }: UpsertPlanProps) {
  const isEditing = !!planId
  const { closeModal } = useModal()

  const planSchema = z.object({
    name: z.string().min(1, 'Plan name is required'),
    description: z.string().min(50, 'Description must be at least 50 characters long'),
    accessSupportDetail: z.string().min(50, 'Access support detail must be at least 50 characters long'),
    maxTeacherSeats: z.number().min(10, 'Must be at least 10'),
    maxStudentSeats: z.number().min(100, 'Must be at least 100'),
    isAddOn: z.boolean(),
    curriculumIds: z.array(z.number())
  })
  const { data: planData } = useGetPlanByIdQuery(planId!, {
    skip: !isEditing
  })
  const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation()
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation()

  const form = useAppForm({
    defaultValues: defaultPlanFormData,
    validators: {
      onChange: planSchema
    },
    onSubmit: async ({ value }) => {
      if (isEditing) {
        await updatePlan({ id: planId!, body: value }).unwrap()
      } else {
        await createPlan(value).unwrap()
      }
      toast.success(`Plan ${isEditing ? 'updated' : 'created'} successfully`)
      closeModal()
      onSuccess && onSuccess()
    }
  })

  // useEffect(() => {
  //   if (isEditing && planData?.data) {
  //     form.reset({
  //       name: planData.data.name,
  //       description: planData.data.description,
  //       accessSupportDetail: planData.data.accessSupportDetail,
  //       maxTeacherSeats: planData.data.maxTeacherSeats,
  //       maxStudentSeats: planData.data.maxStudentSeats,
  //       // isAddOn: planData.data.planBillingCycles.,
  //       // curriculumIds: planData.data.curriculums.map((curriculum) => curriculum.id)
  //     })
  //   }
  // }, [planData, isEditing, form])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className='space-y-4'
    >
      <form.AppField name='name' children={(field) => <field.TextField label='name' placeholder='fill name' />} />

      <form.AppField
        name='description'
        children={(field) => (
          <field.TextAreaField label='description' placeholder='fill description' rows={4} className='resize-none' />
        )}
      />

      <form.AppField
        name='accessSupportDetail'
        children={(field) => (
          <field.TextAreaField
            label='access support detail'
            placeholder='fill access support detail'
            rows={4}
            className='resize-none'
          />
        )}
      />

      <form.AppField
        name='maxTeacherSeats'
        children={(field) => (
          <field.TextField type='number' label='max teacher seats' placeholder='fill max teacher seats' />
        )}
      />

      <form.AppField
        name='maxStudentSeats'
        children={(field) => (
          <field.TextField type='number' label='max student seats' placeholder='fill max student seats' />
        )}
      />

      <form.AppField name='isAddOn' children={(field) => <field.CheckboxField label='is add-on plan' />} />
    </form>
  )
}
