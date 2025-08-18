// src/features/content/components/CreateContent.tsx

'use client'
import React, { useEffect, useMemo } from 'react'
import { z } from 'zod'
import { toast } from 'sonner'
import { SCard } from '@/components/shared/card/SCard'
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

const contentSchema = z.object({
  contentBody: z.string().refine((val) => removeMd(val).replace(/\s/g, '').length >= 50, {
    message: 'Content must have at least 50 characters of actual text (excluding Markdown and whitespace)'
  }),
  contentType: z.enum(ContentType),
  sectionId: z.number().positive({ message: 'Section ID must be a positive number' }),
  file: z.union([z.instanceof(File), z.null()]).optional(),
  filePreviewUrl: z.string().optional()
})

type ContentFormData = z.infer<typeof contentSchema>

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
    ContentType: data.contentType,
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
  const t = useTranslations('sectionManagement')
  const token = useAppSelector((state) => state.auth.token)

  const { data: contentData, isLoading: isContentLoading } = useSearchContentQuery(
    { sectionId },
    {
      skip: !sectionId || !token
    }
  )

  const [createContent] = useCreateContentMutation()
  const [updateContent] = useUpdateContentMutation()

  const contentItem = contentData?.data.items?.[0] ?? null
  console.log('contentItem', contentItem)
  const form = useAppForm({
    // validators: {
    //   onChange: ({ value }) => contentSchema.safeParse(value)
    // },
    defaultValues: defaultContentData,
    onSubmit: async ({ value }) => {
      try {
        const isUpdating = !!contentItem?.id
        if (isUpdating) {
          const patchJson = await PatchContentJsonPayload(contentItem, { ...value, sectionId })
          const res = await updateContent({ id: contentItem.id, body: patchJson }).unwrap()
          toast.success(`Content updated successfully`)
        } else {
          const jsonPayload = await CreateContentJsonPayload({
            ...value,
            sectionId
          })

          await createContent(jsonPayload).unwrap()
          toast.success('Content created successfully')
        }
      } catch (err) {
        toast.error('Failed to submit content')
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
        console.log('Submit event triggered')

        form.handleSubmit()
      }}
    >
      <div>
        <div className='space-y-6'>
          <SCard
            className='w-full gap-3'
            content={
              <div className='space-y-4 p-4'>
                <form.AppField
                  name='contentType'
                  children={(field) => (
                    <field.SelectField
                      label={t('section.contentType.label')}
                      placeholder='Select a type'
                      options={[
                        { value: ContentType.TEXT, label: `${t('section.contentType.text')}` },
                        { value: ContentType.VIDEO, label: `${t('section.contentType.video')}` },
                        { value: ContentType.DOCUMENT, label: `${t('section.contentType.document')}` }
                      ]}
                    />
                  )}
                />

                <form.AppField name='contentBody' children={(field) => <field.MarkdownEditorField />} />
              </div>
            }
          />

          <div className='mb-5'></div>
        </div>

        <form.AppForm>
          <div className='flex w-full justify-end'>
            <form.SubmitButton className='bg-amber-custom-400 rounded-full px-6 py-4'>
              {t('save_btn')}
            </form.SubmitButton>
          </div>
        </form.AppForm>
      </div>
    </form>
  )
}
