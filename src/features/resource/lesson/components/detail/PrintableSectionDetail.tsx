import React from 'react'
import { useSearchContentQuery } from '@/features/resource/content/api/contentApi'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import TiptapViewer from '@/components/tiptap/TiptapViewer'
import { useTranslations } from 'next-intl'

type PrintableSectionDetailProps = {
  sectionId: number
}

function normalizeMarkdown(text: string): string {
  if (!text) return ''
  return text.replace(/\\n/g, '\n')
}

export default function PrintableSectionDetail({ sectionId }: PrintableSectionDetailProps) {
  const t = useTranslations('LessonDetails.notFound')

  const { data: contentData, isLoading, isError } = useSearchContentQuery({ sectionId }, { skip: !sectionId })

  if (isLoading) {
    return (
      <div className='py-4'>
        <LoadingComponent textShow={true} />
      </div>
    )
  }

  if (isError || !contentData || contentData.data.items.length === 0) {
    return <div className='py-2 text-sm text-gray-500 italic'>{t('no_section')}</div>
  }

  const content = contentData.data.items[0]

  return (
    <div className='prose-sm max-w-none'>
      <TiptapViewer content={normalizeMarkdown(content.contentBody)} />
    </div>
  )
}
