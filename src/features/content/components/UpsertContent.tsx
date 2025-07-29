// src/features/content/components/CreateContent.tsx

'use client'
import React, { useEffect, useMemo } from 'react'
import { z } from 'zod'
import { toast } from 'sonner'
import { SCard } from '@/components/shared/card/SCard'
import { useAppForm } from '@/components/shared/form/items'
import {
  useCreateContentWithFormDataMutation,
  useUpdateContentWithFormDataMutation,
  useSearchContentQuery
} from '@/features/content/api/contentApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import removeMd from 'remove-markdown'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'

const contentSchema = z.object({
  contentName: z.string().refine((val) => removeMd(val).replace(/\s/g, '').length >= 50, {
    message: 'Content must have at least 50 characters of actual text (excluding Markdown and whitespace)'
  }),
  contentType: z.enum(['Text', 'Video', 'Document']),
  sectionId: z.number().positive({ message: 'Section ID must be a positive number' }),
  file: z.union([z.instanceof(File), z.null()]).optional(),
  filePreviewUrl: z.string().optional()
})

type ContentFormData = z.infer<typeof contentSchema>

const defaultContentData: Omit<ContentFormData, 'sectionId'> = {
  contentName: '',
  contentType: 'Text',
  file: null,
  filePreviewUrl: ''
}

function buildContentFormData(data: ContentFormData, isUpdate = false) {
  const formData = new FormData()

  formData.append('ContentName', data.contentName || '')
  formData.append('ContentType', data.contentType)

  if (isUpdate) {
    formData.append('Status', 'published')
    formData.append('FileName', '')
  } else {
    formData.append('sectionId', data.sectionId.toString())
  }

  if (data.file) {
    formData.append('File', data.file)
  }

  return formData
}

type UpsertContentProps = {
  sectionId: number
}

export default function UpsertContent({ sectionId }: UpsertContentProps) {
  const token = useAppSelector((state) => state.auth.token)

  const { data: contentData, isLoading: isContentLoading } = useSearchContentQuery(
    { sectionId },
    {
      skip: !sectionId || !token
    }
  )

  const [createContent] = useCreateContentWithFormDataMutation()
  const [updateContent] = useUpdateContentWithFormDataMutation()

  const contentItem = contentData?.data.items?.[0] ?? null

  const form = useAppForm({
    // validators: {
    //   onChange: ({ value }) => contentSchema.safeParse(value)
    // },
    defaultValues: contentItem
      ? {
          contentName: contentItem?.contentName || '',
          contentType: contentItem?.contentType || 'Text',
          sectionId: contentItem?.sectionId || sectionId,
          file: null,
          filePreviewUrl: contentItem?.fileUrl || ''
        }
      : {
          ...defaultContentData,
          sectionId
        },
    onSubmit: async ({ value }) => {
      const isUpdating = !!contentItem?.id
      const formData = buildContentFormData(value, isUpdating)
      try {
        if (isUpdating) {
          await updateContent({ id: contentItem.id, formData }).unwrap()
          toast.success('Content updated successfully')
        } else {
          await createContent(formData).unwrap()
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
        contentName: contentItem?.contentName || '',
        contentType: contentItem?.contentType || 'Text',
        sectionId: contentItem?.sectionId || sectionId,
        file: null,
        filePreviewUrl: contentItem?.fileUrl || ''
      })
    }
  }, [contentData, form])

  const currentContentType = form.state.values.contentType

  // NOTE: The cSpell warnings for the MIME types below can be ignored
  // or added to your cspell dictionary. They are correct technical terms.
  const fileAcceptType = useMemo(() => {
    switch (currentContentType) {
      case 'Video':
        return 'video/*'
      case 'Text':
      case 'Document':
        return '.doc, .docx, .pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      default:
        return ''
    }
  }, [currentContentType])

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
                      label='Content Type'
                      placeholder='Select a type'
                      options={[
                        { value: 'Text', label: 'Text (DOC, PDF)' },
                        { value: 'Video', label: 'Video' },
                        { value: 'Document', label: 'Document (DOC, PDF)' }
                      ]}
                    />
                  )}
                />
                {/* <form.AppField
                  name='contentName'
                  children={(field) => (
                    <field.TextAreaField className='h-50' label='Content Name' placeholder='Enter content name' />
                  )}
                /> */}
                <form.AppField name='contentName' children={(field) => <field.MarkdownEditorField />} />

                {/* <form.AppField
                  name='file'
                  children={(field) => (
                    <field.FileField
                      accept={fileAcceptType}
                      previewUrlFromServer={form.state.values.filePreviewUrl}
                      label={`Upload File`}
                    />
                  )}
                /> */}
              </div>
            }
          />

          <div className='mb-5'></div>
        </div>

        <form.AppForm>
          <div className='flex w-full justify-end'>
            <form.SubmitButton className='rounded-full px-10 py-6 text-xl'>Save </form.SubmitButton>
          </div>
        </form.AppForm>
      </div>
    </form>
  )
}
