'use client'
import React, { useEffect } from 'react'
import { z } from 'zod'
import { toast } from 'sonner'
import { useAppForm } from '@/components/shared/form/items'
import {
  useCreateContentMutation,
  useUpdateContentMutation,
  useGetContentByIdQuery
} from '@/features/resource/content/api/contentApi'
import removeMd from 'remove-markdown'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useTranslations } from 'next-intl'
import { fileToBase64 } from '@/utils/index'
import { ContentType } from '@/features/resource/content/types/content.type'

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
  contentId?: number
}

export default function UpsertContent({ sectionId, contentId }: UpsertContentProps) {
  const tt = useTranslations('toast')

  const { data, isLoading } = useGetContentByIdQuery(contentId!, { skip: !contentId })

  const [createContent] = useCreateContentMutation()
  const [updateContent] = useUpdateContentMutation()

  const contentItem = data?.data ?? null

  const form = useAppForm({
    defaultValues: defaultContentData,
    validators: {
      // onChange: (value) =>
      //   parseWithZod(new FormData(Object.entries(value) as any), {
      //     schema: contentSchema(tv)
      //   })
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
          toast.success(tt('successMessage.update'))
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
    if (contentItem) {
      form.reset({
        contentBody: contentItem?.contentBody || '',
        contentType: contentItem?.contentType || ContentType.TEXT,
        file: null,
        filePreviewUrl: contentItem?.fileUrl || ''
      })
    }
  }, [contentItem, form])

  if (isLoading) {
    return (
      <div>
        <LoadingComponent size={50} />
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
      }}
    >
      <form.AppField
        name='contentBody'
        children={(field) => <field.MarkdownEditorField onSave={form.handleSubmit} />}
      />
    </form>
  )
}
