import { Button } from '@/components/shadcn/button'
import { useAppForm } from '@/components/shared/form/items'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import {
  useCreateComponentMutation,
  useGetComponentByIdQuery,
  useUpdateComponentMutation
} from '@/features/kit-components/api/kitComponentApi'
import { Component, ComponentFormData } from '@/features/kit-components/types/kit-component.type'
import { useGetAllAgeRangeQuery } from '@/features/resource/age-range/api/ageRangeApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { fileToBase64 } from '@/utils/index'
import { useTranslations } from 'next-intl'
import React, { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import z from 'zod'

const defaultComponent: ComponentFormData = {
  name: '',
  description: '',
  image: null,
  imagePreviewUrl: ''
}

async function CreateComponentJsonPayload(data: ComponentFormData) {
  const imagePayload = data.image ? await fileToBase64(data.image) : null

  return {
    name: data.name,
    description: data.description,
    image: imagePayload
  }
}

async function UpdateComponentJsonPayload(data: ComponentFormData) {
  const imagePayload = data.image ? await fileToBase64(data.image) : null

  return {
    name: data.name,
    description: data.description,
    image: imagePayload
  }
}

async function PatchComponentJsonPayload(oldData: ComponentFormData, newData: ComponentFormData): Promise<any> {
  const patchData: Record<string, any> = {}

  if (oldData.name !== newData.name) patchData.name = newData.name
  if (oldData.description !== newData.description) patchData.description = newData.description

  if (newData.image && typeof newData.image !== 'string') {
    const base64 = await fileToBase64(newData.image)
    patchData.image = base64
  }
  return patchData
}

function mapComponentToFormData(component: Component): ComponentFormData {
  return {
    name: component.name ?? '',
    description: component.description ?? '',
    image: null as any,
    imagePreviewUrl: component.imageUrl ?? undefined
  }
}

type UpsertComponentProps = {
  componentId?: number
  onSuccess?: () => void
}

export default function UpsertComponent({ componentId, onSuccess }: UpsertComponentProps) {
  const initialComponentDataRef = useRef<ComponentFormData | null>(null)
  const imageFieldRef = useRef<any>(null)
  const { closeModal } = useModal()
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const t = useTranslations('components')
  const tv = useTranslations('validation')

  const componentSchemas = z.object({
    name: z.string().min(1, tv('required', { length: 1 })),
    description: z.string().optional(),
    image: z
      .union([z.instanceof(File), z.null()])
      .refine((file) => file === null || file.size > 0, tv('component.image'))
      .refine((file) => file === null || file.size < 5 * 1024 * 1024, tv('component.imageSize', { size: 5 })),
    imagePreviewUrl: z.any().optional()
  })

  const userId = useAppSelector((state) => state.auth.user?.userId)

  const { data: ageRanges } = useGetAllAgeRangeQuery()
  const { data: componentData, isLoading } = useGetComponentByIdQuery(componentId!, {
    skip: !componentId
  })

  const [createComponent, { isLoading: isCreating }] = useCreateComponentMutation()
  const [updateComponent, { isLoading: isUpdating }] = useUpdateComponentMutation()
  const isSubmitting = isCreating || isUpdating

  const form = useAppForm({
    defaultValues: componentData?.data ? mapComponentToFormData(componentData.data) : defaultComponent,
    validators: {
      onChange: componentSchemas
    },
    onSubmit: async ({ value }) => {
      console.log('🔹 Raw form value:', value)

      if (componentId) {
        const patchJson = await PatchComponentJsonPayload(initialComponentDataRef.current!, value)
        const res = await updateComponent({ id: componentId, body: patchJson }).unwrap()
        toast.success(tt('successMessage.update', { title: 'Component' }))
      } else {
        const createJson = await CreateComponentJsonPayload(value)
        const res = await createComponent(createJson).unwrap()
        toast.success(tt('successMessage.create', { title: 'Component' }))
      }
      onSuccess?.()
    }
  })

  useEffect(() => {
    if (componentData?.data && componentId) {
      initialComponentDataRef.current = mapComponentToFormData(componentData.data)
      form.reset(mapComponentToFormData(componentData.data))
    }
  }, [componentData, componentId, form])

  if (componentId && (!componentData || isLoading)) {
    return (
      <div className='flex h-fit items-center justify-center text-lg font-semibold text-gray-600'>
        <LoadingComponent />
      </div>
    )
  }

  return (
    <form
      className='space-y-4 px-5'
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.AppField
        name='image'
        children={(field) => {
          imageFieldRef.current = field
          return <field.ImageField previewUrlFromServer={form.state.values.imagePreviewUrl} />
        }}
      />
      {/* Name & Desc */}
      <form.AppField name='name' children={(field) => <field.TextField label={t('form.fields.name')} />} />
      <form.AppField
        name='description'
        children={(field) => <field.TextAreaField label={t('form.fields.description')} />}
      />
      <div className='mb-3 flex justify-end gap-3'>
        <Button type='button' variant='outline' onClick={closeModal}>
          {tc('button.cancel')}
        </Button>
        <form.AppForm>
          <form.SubmitButton loading={isSubmitting} className='bg-amber-custom-400'>
            {tc('button.save')}
          </form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  )
}
