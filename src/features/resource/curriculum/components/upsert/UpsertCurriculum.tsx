'use client'

import { useAppForm } from '@/components/shared/form/items'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import {
  useCreateCurriculumMutation,
  useGetCurriculumByIdQuery,
  useUpdateCurriculumMutation
} from '../../api/curriculumApi'
import { fileToBase64 } from '@/utils/index'
import { CurriculumFormData } from '../../form/curriculumForm.schema'
import { ApiSuccessResponse } from '@/types/baseModel'
import { Curriculum } from '../../types/curriculum.type'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/hooks/redux-hooks'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { Button } from '@/components/shadcn/button'
import { useModal } from '@/providers/ModalProvider'

const defaultCurriculum: CurriculumFormData = {
  code: '',
  title: '',
  description: '',
  imageUrl: undefined,
  imagePreviewUrl: '',
  price: 1000
}
async function CreateCurriculumJsonPayload(data: CurriculumFormData, userId: string) {
  let imageBase64: string | null = null

  if (data.imageUrl && typeof data.imageUrl !== 'string') {
    imageBase64 = await fileToBase64(data.imageUrl)
  }

  return {
    code: data.code,
    title: data.title,
    description: data.description,
    createdByUserId: userId,
    image: imageBase64,
    price: data.price
  }
}

async function PatchCurriculumJsonPayload(
  oldData: CurriculumFormData,
  newData: CurriculumFormData,
  userId: string
): Promise<any> {
  const patchData: Record<string, any> = {
    createdByUserId: userId
  }

  if (oldData.title !== newData.title) patchData.title = newData.title
  if (oldData.description !== newData.description) patchData.description = newData.description
  if (oldData.code !== newData.code) patchData.code = newData.code
  if (oldData.price !== newData.price) patchData.price = newData.price

  if (newData.imageUrl && typeof newData.imageUrl !== 'string') {
    const base64 = await fileToBase64(newData.imageUrl)
    patchData.image = base64
  }

  return patchData
}

function mapCurriculumToFormData(curriculum: ApiSuccessResponse<Curriculum>): CurriculumFormData {
  return {
    code: curriculum.data.code ?? '',
    title: curriculum.data.title ?? '',
    description: curriculum.data.description ?? '',
    imageUrl: null as any,
    imagePreviewUrl: curriculum.data.imageUrl ?? undefined,
    price: curriculum.data.price ?? 1000
  }
}

interface UpsertCurriculumProps {
  curriculumId?: number
  onSuccess?: () => void
}

export default function UpsertCurriculum({ curriculumId, onSuccess }: UpsertCurriculumProps) {
  const t = useTranslations('curriculum')
  const tt = useTranslations('toast')
  const tc = useTranslations('common')
  const { closeModal } = useModal()
  const imageFieldRef = useRef<any>(null)
  const initialCurriculumDataRef = useRef<CurriculumFormData | null>(null)
  const router = useRouter()
  const userId = useAppSelector((state) => state.auth.user?.userId)
  const locale = useLocale()

  const { data: curriculumData, isLoading } = useGetCurriculumByIdQuery(curriculumId!, {
    skip: !curriculumId
  })
  const [createCurriculum, { isLoading: isCreating }] = useCreateCurriculumMutation()
  const [updateCurriculum, { isLoading: isUpdating }] = useUpdateCurriculumMutation()
  const isSubmitting = isCreating || isUpdating

  const form = useAppForm({
    defaultValues: curriculumData?.data ? mapCurriculumToFormData(curriculumData) : defaultCurriculum,
    validators: {},
    onSubmit: async ({ value }) => {
      try {
        if (curriculumId) {
          const patchJson = await PatchCurriculumJsonPayload(initialCurriculumDataRef.current!, value, userId!)
          const res = await updateCurriculum({ id: Number(curriculumId), body: patchJson }).unwrap()
          toast.success(`${tt('successMessage.update', { title: res.data.title })}`, {
            action: {
              label: 'View Curriculum',
              onClick: () => {
                router.push(`/${locale}/admin/curriculum/${res.data.id}`)
              }
            }
          })
        } else {
          const jsonPayload = await CreateCurriculumJsonPayload(value, userId!)
          const res = await createCurriculum(jsonPayload).unwrap()
          toast.success(`${tt('successMessage.create', { title: res.data.title })}`)
          router.push(`/${locale}/admin/curriculum/${res.data.id}`)
        }
        onSuccess?.()
      } catch (err) {
        toast.error(`${tt('errorMessage')}`)
        console.error(err)
      }
    }
  })

  useEffect(() => {
    if (curriculumData?.data && curriculumId) {
      initialCurriculumDataRef.current = mapCurriculumToFormData(curriculumData)
      form.reset(initialCurriculumDataRef.current)
    }
  }, [curriculumData, curriculumId])

  if (curriculumId && (!curriculumData || isLoading)) {
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
      <div className='space-y-6'>
        <form.AppField
          name='imageUrl'
          children={(field) => {
            imageFieldRef.current = field
            return <field.ImageField previewUrlFromServer={form.state.values.imagePreviewUrl} />
          }}
        />
        <div className='grid grid-cols-2 gap-5'>
          <form.AppField
            name='code'
            children={(field) => (
              <field.TextField
                label={t('form.fields.code.label')}
                placeholder={t('form.fields.code.placeholder')}
                className='rounded-lg border-gray-300'
                disabled={!!curriculumId}
              />
            )}
          />
          <form.AppField
            name='title'
            children={(field) => (
              <field.TextField
                label={t('form.fields.name.label')}
                placeholder={t('form.fields.name.placeholder')}
                className='rounded-lg border-gray-300'
              />
            )}
          />
        </div>

        <form.AppField
          name='description'
          children={(field) => (
            <field.TextAreaField
              label={t('form.fields.description.label')}
              placeholder={t('form.fields.description.placeholder')}
              className='h-45 rounded-lg border-gray-300'
            />
          )}
        />
      </div>
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
