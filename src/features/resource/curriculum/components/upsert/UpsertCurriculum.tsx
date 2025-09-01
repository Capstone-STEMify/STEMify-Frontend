'use client'

import { SCard } from '@/components/shared/card/SCard'
import { useAppForm } from '@/components/shared/form/items'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import z from 'zod'
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

function mapCurriculumToFormData(course: ApiSuccessResponse<Curriculum>): CurriculumFormData {
  return {
    code: course.data.code ?? '',
    title: course.data.title ?? '',
    description: course.data.description ?? '',
    imageUrl: null as any,
    imagePreviewUrl: course.data.imageUrl ?? undefined
  }
}

interface UpsertCurriculumProps {
  curriculumId?: number
  onSuccess?: () => void
  inModal?: boolean
}

export default function UpsertCurriculum({ curriculumId, onSuccess, inModal }: UpsertCurriculumProps) {
  // Translations
  const t = useTranslations('curriculum')
  const tBtn = useTranslations('button')
  const imageFieldRef = useRef<any>(null)
  const gridCols = inModal ? 'grid-cols-1' : 'sm:grid-cols-1 lg:grid-cols-3'
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
          toast.success(`${t('form.successMessage.update')} (${res.data.title})`, {
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
          toast.success(`${t('form.successMessage.create')} (${res.data.title})`)
          router.push(`/${locale}/resource/curriculum/${res.data.id}`)
        }
      } catch (err) {
        toast.error(`${t('form.errorMessage')}`)
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
      <div className='flex h-screen items-center justify-center text-lg font-semibold text-gray-600'>
        <LoadingComponent />
      </div>
    )
  }

  return (
    <div>
      <form
        className='space-y-4'
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <div className={`grid gap-8 ${gridCols}`}>
          <div className='space-y-6 lg:col-span-2'>
            <SCard
              className='gap-3'
              title={t('form.fields.code.label')}
              description={t('form.fields.code.note')}
              content={
                <form.AppField
                  name='code'
                  children={(field) => (
                    <field.TextField
                      placeholder={t('form.fields.code.placeholder')}
                      className='rounded-lg border-gray-300'
                    />
                  )}
                />
              }
            />
            <SCard
              className='gap-3'
              title={t('form.fields.name.label')}
              description={t('form.fields.name.note')}
              content={
                <form.AppField
                  name='title'
                  children={(field) => (
                    <field.TextField
                      placeholder={t('form.fields.name.placeholder')}
                      className='rounded-lg border-gray-300'
                    />
                  )}
                />
              }
            />
            <SCard
              className='gap-3'
              title={t('form.fields.description.label')}
              description={t('form.fields.description.note')}
              content={
                <form.AppField
                  name='description'
                  children={(field) => (
                    <field.TextAreaField
                      placeholder={t('form.fields.description.placeholder')}
                      className='h-30 rounded-lg border-gray-300'
                    />
                  )}
                />
              }
            />
          </div>
          <div className='space-y-6'>
            <form.AppField
              name='imageUrl'
              children={(field) => {
                imageFieldRef.current = field
                return <field.ImageField previewUrlFromServer={form.state.values.imagePreviewUrl} />
              }}
            />

            <form.AppForm>
              <form.SubmitButton loading={isSubmitting} className='bg-amber-custom-400 w-full rounded-full'>
                {tBtn('save')}
              </form.SubmitButton>
            </form.AppForm>
          </div>
        </div>
      </form>
    </div>
  )
}
