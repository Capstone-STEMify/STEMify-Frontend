'use client'
import React, { useEffect, useState } from 'react'
import {
  useCreateContentMutation,
  useUpdateContentMutation,
  useGetContentByIdQuery
} from '@/features/resource/content/api/contentApi'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useLocale, useTranslations } from 'next-intl'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import TiptapEditor from '@/components/tiptap/TiptapEditor'
import { ContentType } from '@/features/resource/content/types/content.type'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { resetSaveTrigger } from '@/features/resource/content/slice/editorSlice'

type UpsertContentProps = {
  lessonId?: number
  sectionId: number
  contentId?: number
}

export default function UpsertContent({ lessonId, sectionId, contentId }: UpsertContentProps) {
  const tt = useTranslations('toast')
  const { data, isLoading } = useGetContentByIdQuery(contentId!, { skip: !contentId })
  const dispatch = useAppDispatch()
  const router = useRouter()
  const locale = useLocale()

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
      toast.success(tt('successMessage.updateNoTitle'))
    } else {
      const res = await createContent({
        contentBody: editorValue,
        contentType: ContentType.TEXT,
        sectionId: sectionId
      })
      toast.success(tt('successMessage.createNoTitle'))
      router.push(`/${locale}/admin/lesson/${lessonId}/section/${sectionId}/content/${res.data?.data.id}`)
    }
  }

  useEffect(() => {
    if (saveTrigger) {
      handleUpsert().finally(() => {
        dispatch(resetSaveTrigger())
      })
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
