'use client'
import React, { useEffect } from 'react'
import { z } from 'zod'
import { toast } from 'sonner'
import { useAppForm } from '@/components/shared/form/items'
import {
  useSearchContentQuery,
  useCreateContentMutation,
  useUpdateContentMutation
} from '@/features/content/api/contentApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import removeMd from 'remove-markdown'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useTranslations } from 'next-intl'
import { fileToBase64 } from '@/utils/index'
import { ContentType } from '@/features/content/types/content.type'
import { parseWithZod } from '@conform-to/zod/v4'

const contentSchema = (tv: ReturnType<typeof useTranslations<'validation'>>) =>
  z.object({
    contentBody: z.string().refine((val) => removeMd(val).replace(/\s/g, '').length >= 50, {
      message: tv('content.length')
    }),
    contentType: z.enum(ContentType),
    sectionId: z.number().positive({ message: tv('content.sectionId') }),
    file: z.union([z.instanceof(File), z.null()]).optional(),
    filePreviewUrl: z.string().optional()
  })

type ContentFormData = z.infer<ReturnType<typeof contentSchema>>

const defaultContentData: Omit<ContentFormData, 'sectionId'> = {
  contentBody: '',
  contentType: ContentType.TEXT,
  file: null,
  filePreviewUrl: ''
}

async function CreateContentJsonPayload(data: ContentFormData) {
  let fileBase64: string | null = null

  if (data.file && typeof data.file !== 'string') {
    fileBase64 = await fileToBase64(data.file)
  }

  return {
    contentBody: data.contentBody,
    contentType: data.contentType,
    sectionId: data.sectionId,
    file: fileBase64
  }
}

async function PatchContentJsonPayload(oldData: ContentFormData, newData: ContentFormData) {
  const patchData: Record<string, any> = {}
  if (oldData.contentBody !== newData.contentBody) patchData.contentBody = newData.contentBody
  if (oldData.contentType !== newData.contentType) patchData.contentType = newData.contentType
  return patchData
}

type UpsertContentProps = {
  sectionId: number
}

export default function UpsertContent({ sectionId }: UpsertContentProps) {
  const tv = useTranslations('validation')
  const tt = useTranslations('toast')
  const tc = useTranslations('common')
  const token = useAppSelector((state) => state.auth.token)

  const { data: contentData, isLoading: isContentLoading } = useSearchContentQuery(
    { sectionId },
    { skip: !sectionId || !token }
  )

  const [createContent] = useCreateContentMutation()
  const [updateContent] = useUpdateContentMutation()

  const contentItem = contentData?.data.items?.[0] ?? null

  const form = useAppForm({
    defaultValues: defaultContentData,
    validators: {
      onChange: (value) =>
        parseWithZod(new FormData(Object.entries(value) as any), {
          schema: contentSchema(tv)
        })
    },
    onSubmit: async ({ value }) => {
      try {
        const isUpdating = !!contentItem?.id
        if (isUpdating) {
          const patchJson = await PatchContentJsonPayload(contentItem, {
            ...value,
            sectionId,
            contentType: ContentType.TEXT
          })
          const res = await updateContent({ id: contentItem.id, body: patchJson }).unwrap()
          toast.success(tt('successMessage.update', { title: res.data.contentName }))
        } else {
          const jsonPayload = await CreateContentJsonPayload({
            ...value,
            contentType: ContentType.TEXT,
            sectionId
          })
          await createContent(jsonPayload).unwrap()
          toast.success(tt('successMessage.create'))
        }
      } catch (err) {
        toast.error(tt('errorMessage'))
        console.error(err)
      }
    }
  })

  useEffect(() => {
    if (contentData?.data) {
      form.reset({
        contentBody: contentItem?.contentName || '',
        contentType: contentItem?.contentType || ContentType.TEXT,
        file: null,
        filePreviewUrl: contentItem?.fileUrl || ''
      })
    }
  }, [contentData, form])

  if (isContentLoading) {
    return (
      <div>
        <LoadingComponent size={50} />
      </div>
    )
  }

  return (
    <form
      className='mt-5 w-full space-y-8'
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <div>
        <div className='space-y-6'>
          <div className='p-4'>
            <form.AppField name='contentBody' children={(field) => <field.MarkdownEditorField />} />
          </div>
          <div className='mb-5'></div>
        </div>

        <form.AppForm>
          <div className='flex w-full justify-end'>
            <form.SubmitButton className='bg-amber-custom-400 rounded-full px-6 py-4'>
              {tc('button.save')}
            </form.SubmitButton>
          </div>
        </form.AppForm>
      </div>
    </form>
  )
}
