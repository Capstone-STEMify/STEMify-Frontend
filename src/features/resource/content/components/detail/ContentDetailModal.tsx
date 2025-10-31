'use client'
import { Button } from '@/components/shadcn/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { useSearchContentQuery } from '@/features/resource/content/api/contentApi'
import ContentDetail from '@/features/resource/content/components/detail/ContentDetail'
import { ContentType } from '@/features/resource/content/types/content.type'
import { useModal } from '@/providers/ModalProvider'
import { useLocale, useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'

type ContentDetailModalProps = {
  sectionId: number
}

export default function ContentDetailModal({ sectionId }: ContentDetailModalProps) {
  const t = useTranslations('content')
  const tc = useTranslations('common')
  const { closeModal } = useModal()
  const router = useRouter()
  const locale = useLocale()
  const { lessonId } = useParams()
  const { data: contentData, isLoading } = useSearchContentQuery({ sectionId })

  const handleEditContent = () => {
    closeModal()
    if (!contentData?.data?.items?.length) {
      router.push(`/${locale}/admin/lesson/${lessonId}/section/${sectionId}`)
    } else if (contentData.data.items[0].contentType === ContentType.TEXT) {
      router.push(`/${locale}/admin/lesson/${lessonId}/section/${sectionId}/content/${contentData.data.items[0].id}`)
    } else if (contentData.data.items[0].contentType === ContentType.QUIZ) {
      router.push(
        `/${locale}/admin/lesson/${lessonId}/section/${sectionId}/quiz/${contentData.data.items[0].quizId}/question`
      )
    }
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogTitle className='flex items-center justify-between'>
          <div>{t('detail.title')}</div>
          <div className='mr-5'>
            <Button variant={'outline'} className='hover:bg-gray-200' onClick={handleEditContent}>
              {!contentData?.data?.items?.length ? tc('button.create') : tc('button.update')}
            </Button>
          </div>
        </DialogTitle>
        <hr />

        <ScrollArea className='h-[60vh] w-[70vw] max-w-6xl'>
          {contentData &&
          contentData.data.items.length > 0 &&
          contentData.data.items[0].contentType === ContentType.QUIZ ? (
            <ContentDetail sectionId={sectionId} quizId={contentData.data.items[0].quizId} />
          ) : (
            <ContentDetail sectionId={sectionId} />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
