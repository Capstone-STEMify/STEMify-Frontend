import { Button } from '@/components/shadcn/button'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import TiptapViewer from '@/components/tiptap/TiptapViewer'
import { useSearchContentQuery } from '@/features/resource/content/api/contentApi'
import { useModal } from '@/providers/ModalProvider'
import { normalizeMarkdown } from '@/utils/index'
import { FilePlus } from 'lucide-react'
import { useTranslations } from 'next-intl'

type ContentDetailProps = {
  sectionId: number
}

export default function ContentDetail({ sectionId }: ContentDetailProps) {
  const t = useTranslations('content')
  const { data: contentData, isLoading } = useSearchContentQuery({ sectionId })
  const { openModal } = useModal()

  const html = contentData?.data?.items?.[0]?.contentBody || ''
  console.log('html', html)

  const handleCreateContent = () => {
    openModal('upsertContent', { sectionId })
  }

  if (isLoading)
    return (
      <div className='flex items-center justify-center'>
        <LoadingComponent size={150} />
      </div>
    )
  if (!contentData?.data?.items?.length)
    return (
      <div className='flex flex-col items-center justify-center space-y-4 rounded-2xl border bg-gray-50 py-10 text-center'>
        <h3 className='text-lg font-semibold text-gray-800'>{t('detail.noData')}</h3>
        <p className='text-gray-500'>{t('detail.noDataDetail')}</p>
        <Button onClick={handleCreateContent} className='bg-amber-custom-400 flex items-center gap-2'>
          <FilePlus className='h-4 w-4' />
          {t('form.title.create')}
        </Button>
      </div>
    )

  return (
    <div>
      {/* temporarily get the first content */}
      <TiptapViewer content={normalizeMarkdown(contentData?.data.items[0].contentBody)} />
    </div>
  )
}
