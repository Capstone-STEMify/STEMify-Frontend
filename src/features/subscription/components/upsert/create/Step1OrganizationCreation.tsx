import { Button } from '@/components/shadcn/button'
import { useAppForm } from '@/components/shared/form/items'
import {
  useCreateOrganizationMutation,
  useGetAllOrganizationTypesQuery,
  useGetOrganizationByIdQuery,
  useUpdateOrganizationMutation
} from '@/features/organization/api/organizationApi'
import { OrganizationFormData } from '@/features/organization/types/organization.type'
import { useGetPlanByIdQuery } from '@/features/plan/api/planApi'
import { useOrganizationSubscriptionForm } from '@/features/subscription/components/upsert/create/useOrganizationSubscriptionForm'
import { setOrganizationId } from '@/features/subscription/slice/subscriptionFormSlice'
import { useAppDispatch } from '@/hooks/redux-hooks'
import { fileToBase64 } from '@/utils/index'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import z from 'zod'

const organizationDefaultValues: OrganizationFormData = {
  name: '',
  description: '',
  organizationTypeId: '',
  image: null,
  imageUrl: ''
}

export default function Step1OrganizationCreation({
  formWizard
}: {
  formWizard: ReturnType<typeof useOrganizationSubscriptionForm>
}) {
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams()
  const organizationId = searchParams.get('organizationId')

  const { currentStep, goBack, goNext } = formWizard
  const imageFieldRef = useRef<any>(null)

  const { data: orgData } = useGetOrganizationByIdQuery(Number(1), {
    skip: !organizationId
  })

  const { data: orgTypesData, isLoading } = useGetAllOrganizationTypesQuery({ pageNumber: 1, pageSize: 50 })
  const [createOrg, { isLoading: isCreating }] = useCreateOrganizationMutation()
  const [updateOrg, { isLoading: isUpdating }] = useUpdateOrganizationMutation()

  const orgTypes = orgTypesData?.data.items || []
  const organizationTypesOptions = orgTypes.map((type) => ({ label: type.name, value: String(type.id) }))

  const organizationSchema = z.object({
    name: z.string().min(1, 'Organization name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    organizationTypeId: z
      .string()
      .min(1, 'Select organization type')
      .refine((val) => val !== '0', 'Select organization type'),
    image: z
      .union([z.instanceof(File), z.null()])
      .refine((file) => file === null || file.size > 0, 'Image file is required')
      .refine((file) => file === null || file.size < 5 * 1024 * 1024, 'Image file must be less than 5MB'),
    imagePreviewUrl: z.string().optional()
  })

  const form = useAppForm({
    defaultValues: organizationDefaultValues,
    validators: { onChange: organizationSchema },
    onSubmit: async ({ value }) => {
      let imageBase64: string | null = null
      if (value.image && typeof value.image !== 'string') {
        imageBase64 = await fileToBase64(value.image)
      }
      const payload = {
        name: value.name,
        description: value.description,
        organizationTypeId: Number(value.organizationTypeId),
        image: imageBase64
      }
      if (organizationId) {
        const res = await updateOrg({ id: Number(organizationId), body: payload }).unwrap()
        dispatch(setOrganizationId(res.data.id))
        toast.message('Organization updated successfully')
      } else {
        const res = await createOrg(payload).unwrap()
        dispatch(setOrganizationId(res.data.id))
        toast.message('Organization created successfully')
      }
      goNext()
    }
  })

  useEffect(() => {
    if (organizationId && orgData?.data) {
      const matchedType = orgTypes.find(
        (type) => type.name.toLowerCase() === orgData.data.organizationType.toLowerCase()
      )

      form.reset({
        name: orgData.data.name,
        description: orgData.data.description,
        organizationTypeId: matchedType ? String(matchedType.id) : '',
        image: null,
        imageUrl: orgData.data.imageUrl
      })
    }
  }, [organizationId, orgData, form])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit(e)
      }}
      className='space-y-6'
    >
      <form.AppField name='name'>
        {(field) => <field.TextField label='Organization Name' placeholder='Enter name' />}
      </form.AppField>

      <form.AppField name='description'>
        {(field) => <field.TextAreaField label='Description' rows={3} placeholder='Description' />}
      </form.AppField>

      <form.AppField name='image'>
        {(field) => {
          imageFieldRef.current = field
          return <field.ImageField key={form.state.values.imageUrl} previewUrlFromServer={form.state.values.imageUrl} />
        }}
      </form.AppField>

      <form.AppField name='organizationTypeId'>
        {(field) => (
          <field.SelectField
            label='Organization Type'
            placeholder='Select Organization Type'
            options={organizationTypesOptions}
            disabled={isLoading}
          />
        )}
      </form.AppField>

      {/* {Object.keys(form.state.errors).length > 0 && (
        <div className='rounded-md bg-red-50 p-4'>
          <h3 className='text-sm font-medium text-red-800'>Please fix the following errors:</h3>
          <ul className='mt-2 list-disc space-y-1 pl-5 text-sm text-red-700'>
            {Object.entries(form.state.errors).map(([field, errorObj], i) => {
              const message =
                typeof errorObj === 'string' ? errorObj : (errorObj as any)?.message || JSON.stringify(errorObj)
              return (
                <li key={i}>
                  <b>{field}</b>: {message}
                </li>
              )
            })}
          </ul>
        </div>
      )} */}

      {/* Navigation */}
      <div className='mt-5 flex items-center justify-between'>
        <Button variant='outline' onClick={goBack} disabled={currentStep === 1}>
          Back
        </Button>

        <div className='text-sm text-slate-600'>Step {currentStep} of 4</div>

        <form.AppForm>
          <form.SubmitButton loading={isCreating || isUpdating}>Next</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  )
}
