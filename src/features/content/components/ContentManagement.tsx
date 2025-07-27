// src/features/content/components/CreateContent.tsx

'use client'
import React, { useEffect, useMemo } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { toast } from 'sonner'
import { SCard } from '@/components/shared/card/SCard'
import { useAppForm } from '@/components/shared/form/items'
import {
  useGetContentByIdQuery,
  useCreateContentWithFormDataMutation,
  useUpdateContentWithFormDataMutation
} from '@/features/content/api/contentApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useGetSectionByIdQuery } from '@/features/resource/section/api/sectionApi'

const contentSchema = z.object({
  contentName: z.string().min(5, 'Content name must be at least 5 characters long'),
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

export default function ContentManagement() {
  const params = useParams()
  const token = useAppSelector((state) => state.auth.token)

  const sectionIdFromParams = params.sectionId ? Number(params.sectionId) : 0
  const contentIdRaw = params?.contentId
  const contentId = contentIdRaw ? Number(Array.isArray(contentIdRaw) ? contentIdRaw[0] : contentIdRaw) : undefined

  const { data: sectionData } = useGetSectionByIdQuery(sectionIdFromParams, {
    skip: !sectionIdFromParams || !token
  })

  const { data: contentData, isLoading: isContentLoading } = useGetContentByIdQuery(contentId as number, {
    skip: !contentId || !token
  })

  const [createContent] = useCreateContentWithFormDataMutation()
  const [updateContent] = useUpdateContentWithFormDataMutation()

  const form = useAppForm({
    defaultValues: contentData?.data
      ? {
          contentName: contentData.data.contentName || '',
          contentType: contentData.data.contentType,
          sectionId: contentData.data.sectionId || sectionIdFromParams,
          file: null,
          filePreviewUrl: contentData.data.fileUrl || ''
        }
      : {
          ...defaultContentData,
          sectionId: sectionIdFromParams
        },
    onSubmit: async ({ value }) => {
      const isUpdating = !!contentId
      const formData = buildContentFormData(value, isUpdating)
      try {
        if (isUpdating) {
          await updateContent({ id: contentId, formData }).unwrap()
          toast.success('Content updated successfully')
        } else {
          await createContent(formData).unwrap()
          toast.success('Content created successfully')
          form.reset()
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
        contentName: contentData.data.contentName || '',
        contentType: contentData.data.contentType,
        sectionId: contentData.data.sectionId || sectionIdFromParams,
        file: null,
        filePreviewUrl: contentData.data.fileUrl || ''
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
      <div className='flex h-screen items-center justify-center text-lg font-semibold text-gray-600'>Loading...</div>
    )
  }

  return (
    <form
      className='min-h-screen space-y-8 p-4 md:p-8'
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <div>
        <div className='space-y-6'>
          <SCard
            className='w-full gap-3'
            title={`Section: ${sectionData?.data.description}`}
            description='Fill in the details for this content'
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
                <form.AppField
                  name='contentName'
                  children={(field) => (
                    <field.TextAreaField className='h-50' label='Content Name' placeholder='Enter content name' />
                  )}
                />

                <form.AppField
                  name='file'
                  children={(field) => (
                    // Use the new FileField instead of ImageField wrapped in SCard
                    <field.FileField
                      accept={fileAcceptType}
                      previewUrlFromServer={form.state.values.filePreviewUrl}
                      label={`Upload File`}
                    />
                  )}
                />
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
