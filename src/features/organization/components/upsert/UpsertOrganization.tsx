import { useAppForm } from '@/components/shared/form/items'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import {
  useCreateOrganizationMutation,
  useGetAllOrganizationTypesQuery,
  useGetOrganizationByIdQuery,
  useUpdateOrganizationMutation
} from '@/features/organization/api/organizationApi'
import { OrganizationFormData } from '@/features/organization/types/organization.type'
import { fileToBase64 } from '@/utils/index'
import { useTranslations } from 'next-intl'
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

type UpsertOrganizationProps = {
  organizationId?: number
  onSuccess?: () => void
}

export default function UpsertOrganization({ organizationId, onSuccess }: UpsertOrganizationProps) {
  const tv = useTranslations('validation')
  const tt = useTranslations('toast')
  const tc = useTranslations('common')
  const tOrganization = useTranslations('organization')

  const imageFieldRef = useRef<any>(null)

  const { data: orgData, isLoading: isOrgLoading } = useGetOrganizationByIdQuery(Number(organizationId), {
    skip: !organizationId
  })

  const { data: orgTypesData, isLoading: isOrgTypesLoading } = useGetAllOrganizationTypesQuery({
    pageNumber: 1,
    pageSize: 50
  })
  const [createOrg, { isLoading: isCreating, isError: isCreateError }] = useCreateOrganizationMutation()
  const [updateOrg, { isLoading: isUpdating, isError: isUpdateError }] = useUpdateOrganizationMutation()

  const orgTypes = orgTypesData?.data.items || []
  const organizationTypesOptions = orgTypes.map((type) => ({ label: type.name, value: String(type.id) }))

  const organizationSchema = z.object({
    name: z.string().min(1, tv('organization.name')),
    description: z.string().min(10, tv('organization.description')),
    organizationTypeId: z
      .string()
      .min(1, tv('organization.type'))
      .refine((val) => val !== '0', tv('organization.type')),
    image: z
      .union([z.instanceof(File), z.null()])
      .refine((file) => file === null || file.size > 0, tv('organization.imageUrl'))
      .refine((file) => file === null || file.size < 5 * 1024 * 1024, tv('organization.imageSize', { size: 5 })),
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
        await updateOrg({ id: Number(organizationId), body: payload }).unwrap()
        toast.success(tt('successMessage.updateNoTitle'))
        onSuccess?.()
      } else {
        await createOrg(payload).unwrap()
        toast.success(tt('successMessage.createNoTitle'))
        onSuccess?.()
      }
      if (!isCreateError || !isUpdateError) {
      }
    }
  })

  useEffect(() => {
    if (organizationId && orgData?.data && orgTypes.length > 0) {
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
  }, [organizationId, orgData, orgTypes, form])

  if ((organizationId && (!orgData || isOrgLoading)) || isOrgTypesLoading) {
    return (
      <div className='flex h-screen items-center justify-center text-lg font-semibold text-gray-600'>
        <LoadingComponent />
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit(e)
      }}
      className='space-y-6'
    >
      <form.AppField name='image'>
        {(field) => {
          imageFieldRef.current = field
          return <field.ImageField key={form.state.values.imageUrl} previewUrlFromServer={form.state.values.imageUrl} />
        }}
      </form.AppField>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <form.AppField name='name'>
          {(field) => (
            <field.TextField label={tOrganization('name')} placeholder={tOrganization('form.placeholder.name')} />
          )}
        </form.AppField>
        <form.AppField name='organizationTypeId'>
          {(field) => (
            <field.SelectField
              label={tOrganization('type')}
              placeholder={tOrganization('type')}
              options={organizationTypesOptions}
              disabled={isOrgTypesLoading}
            />
          )}
        </form.AppField>
      </div>

      <form.AppField name='description'>
        {(field) => <field.TextAreaField label='Description' placeholder='Description' rows={5} className='max-h-40' />}
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

      <div className='mt-5 flex items-center justify-end'>
        <form.AppForm>
          <form.SubmitButton loading={isCreating || isUpdating}>{tc('button.save')}</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  )
}
