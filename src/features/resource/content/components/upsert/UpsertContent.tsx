'use client'
import React, { useEffect, useState } from 'react'
import {
  useCreateContentMutation,
  useUpdateContentMutation,
  useGetContentByIdQuery
} from '@/features/resource/content/api/contentApi'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useTranslations } from 'next-intl'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import TiptapEditor from '@/components/tiptap/TiptapEditor'
import { ContentType } from '@/features/resource/content/types/content.type'
import { toast } from 'sonner'

type UpsertContentProps = {
  sectionId: number
  contentId?: number
}

export default function UpsertContent({ sectionId, contentId }: UpsertContentProps) {
  const tt = useTranslations('toast')
  const { data, isLoading } = useGetContentByIdQuery(contentId!, { skip: !contentId })
  const dispatch = useAppDispatch()

  const [createContent] = useCreateContentMutation()
  const [updateContent] = useUpdateContentMutation()

  const contentItem = data?.data ?? null
  const [editorValue, setEditorValue] = useState<string>(contentItem?.contentBody ?? '')

  const saveTrigger = useAppSelector((state) => state.editor.saveTrigger)

  const handleUpsert = async () => {
    if (contentId) {
      await updateContent({
        id: contentId,
        body: {
          contentBody: editorValue,
          contentType: ContentType.TEXT,
          sectionId
        }
      })
      toast.success(tt('successMessage.update'))
    } else {
      await createContent({
        contentBody: editorValue,
        contentType: ContentType.TEXT,
        sectionId: sectionId
      })
      toast.success(tt('successMessage.create'))
    }
  }

  useEffect(() => {
    if (saveTrigger) {
      handleUpsert()
    }
  }, [saveTrigger])

  useEffect(() => {
    if (contentItem) {
      setEditorValue(contentItem.contentBody)
    }
  }, [contentItem])

  if (isLoading) {
    return (
      <div>
        <LoadingComponent size={50} />
      </div>
    )
  }

  return (
    <div className='h-full w-full'>
      <TiptapEditor content={editorValue} onChange={(val) => setEditorValue(val || '')} />
    </div>
  )
}
