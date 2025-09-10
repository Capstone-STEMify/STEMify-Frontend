import { Button } from '@/components/shadcn/button'
import { useAppForm } from '@/components/shared/form/items'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useCreateKitMutation, useGetKitByIdQuery, useUpdateKitMutation } from '@/features/resource/kit/api/kitApi'
import { KitFormData } from '@/features/resource/kit/components/form/kitForm.schema'
import { Kit } from '@/features/resource/kit/types/kit.type'
import { useModal } from '@/providers/ModalProvider'
import { fileToBase64 } from '@/utils/index'
import { useTranslations } from 'next-intl'
import React, { useEffect, useRef } from 'react'
import { toast } from 'sonner'

const defaultKit: KitFormData = {
  name: '',
  description: '',
  images: []
}

async function CreateKitJsonPayload(data: KitFormData) {
  const imagesPayload = await Promise.all(
    data.images.map(async (img, index) => ({
      image: await fileToBase64(img),
      altText: `${data.name} ${index + 1}`
    }))
  )

  return {
    name: data.name,
    description: data.description,
    images: imagesPayload
  }
}

async function PatchKitJsonPayload(oldData: KitFormData, newData: KitFormData): Promise<any> {
  const patchData: Record<string, any> = {}

  if (oldData.name !== newData.name) patchData.name = newData.name
  if (oldData.description !== newData.description) patchData.description = newData.description
  if (oldData.images !== newData.images) patchData.images = newData.images

  return patchData
}

function mapKitToFormData(kit: Kit): KitFormData {
  return {
    name: kit.name ?? '',
    description: kit.description ?? '',
    images: []
  }
}

type UpsertKitProps = {
  kitId?: number
  onSuccess?: () => void
}

export default function UpsertKit({ kitId, onSuccess }: UpsertKitProps) {
  const initialKitDataRef = useRef<KitFormData | null>(null)
  const { closeModal } = useModal()
  const tc = useTranslations('common')

  const { data: kitData, isLoading } = useGetKitByIdQuery(kitId!, {
    skip: !kitId
  })

  const [createKit, { isLoading: isCreating }] = useCreateKitMutation()
  const [updateKit, { isLoading: isUpdating }] = useUpdateKitMutation()
  const isSubmitting = isCreating || isUpdating

  const form = useAppForm({
    defaultValues: kitData?.data ? mapKitToFormData(kitData.data) : defaultKit,
    validators: {},
    onSubmit: async ({ value }) => {
      console.log('🔹 Raw form value:', value)

      try {
        if (kitId) {
          const patchJson = await PatchKitJsonPayload(initialKitDataRef.current!, value)
          const res = await updateKit({ id: kitId, body: patchJson }).unwrap()
          toast.success(tc('toast.update_success', { name: 'Kit' }))
        } else {
          const createJson = await CreateKitJsonPayload(value)
          const res = await createKit(createJson).unwrap()
          toast.success(tc('toast.create_success', { name: 'Kit' }))
        }
        onSuccess?.()
      } catch (error: any) {
        console.error('Error submitting form:', error.message)
      }
    }
  })

  useEffect(() => {
    if (kitData?.data && kitId) {
      initialKitDataRef.current = mapKitToFormData(kitData.data)
      form.reset(mapKitToFormData(kitData.data))
    }
  }, [kitData, kitId, form])

  const previewUrlsFromServer = kitData?.data?.images?.map((img) => img.imageUrl) ?? []

  if (kitId && (!kitData || isLoading)) {
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
      <form.AppField name='name' children={(field) => <field.TextField label='Name' placeholder='Enter kit name' />} />
      <form.AppField
        name='description'
        children={(field) => (
          <field.TextAreaField label='Description' placeholder='Enter kit description' className='min-h-[120px]' />
        )}
      />

      <form.AppField
        name='images'
        children={(field) => <field.MultiImageField label='Kit Image' previewUrlsFromServer={previewUrlsFromServer} />}
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
