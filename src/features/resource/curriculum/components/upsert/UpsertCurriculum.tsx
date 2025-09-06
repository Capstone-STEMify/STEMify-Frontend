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

const defaultCurriculum: CurriculumFormData = {
  code: '',
  title: '',
  description: '',
  imageUrl: undefined,
  imagePreviewUrl: ''
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
    image: imageBase64
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
    imagePreviewUrl: curriculum.data.imageUrl ?? undefined
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
  const imageFieldRef = useRef<any>(null)
  const initialCurriculumDataRef = useRef<CurriculumFormData | null>(null)
  const router = useRouter()
  const userId = useAppSelector((state) => state.auth.user?.userId)
  const locale = useLocale()

  const { data: curriculumData, isLoading } = useGetCurriculumByIdQuery(curriculumId ? Number(curriculumId) : 0, {
    skip: !curriculumId
  })
  const [createCurriculum, { isLoading: isCreating }] = useCreateCurriculumMutation()
  const [updateCurriculum, { isLoading: isUpdating }] = useUpdateCurriculumMutation()
  const isSubmitting = isCreating || isUpdating

  const form = useAppForm({
    defaultValues: curriculumId && curriculumData?.data ? mapCurriculumToFormData(curriculumData) : defaultCurriculum,
    validators: {},
    onSubmit: async ({ value }) => {
      try {
        if (curriculumId) {
          const patchJson = await PatchCurriculumJsonPayload(initialCurriculumDataRef.current!, value, userId!)
          const res = await updateCurriculum({ id: Number(curriculumId), body: patchJson }).unwrap()
          toast.success(`${tt('successMessage.update')} (${res.data.title})`, {
            action: {
              label: 'View Curriculum',
              onClick: () => {
                router.push(`/${locale}/resource/curriculum/${res.data.id}`)
              }
            }
          })
        } else {
          const jsonPayload = await CreateCurriculumJsonPayload(value, userId!)
          const res = await createCurriculum(jsonPayload).unwrap()
          toast.success(`${tt('successMessage.create')} (${res.data.title})`)
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
      className='space-y-4 px-7'
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
        <form.AppField
          name='code'
          children={(field) => (
            <field.TextField
              label='Code'
              placeholder={t('form.fields.code.placeholder')}
              className='rounded-lg border-gray-300'
            />
          )}
        />

        <form.AppField
          name='title'
          children={(field) => (
            <field.TextField
              label='Title'
              placeholder={t('form.fields.name.placeholder')}
              className='rounded-lg border-gray-300'
            />
          )}
        />

        <form.AppField
          name='description'
          children={(field) => (
            <field.TextAreaField
              label='Description'
              placeholder={t('form.fields.description.placeholder')}
              className='h-30 rounded-lg border-gray-300 lg:w-[550px]'
            />
          )}
        />
      </div>
      <div className='flex justify-end'>
        <form.AppForm>
          <form.SubmitButton loading={isSubmitting} className='bg-amber-custom-400 rounded-full'>
            {tc('button.save')}
          </form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  )
}
