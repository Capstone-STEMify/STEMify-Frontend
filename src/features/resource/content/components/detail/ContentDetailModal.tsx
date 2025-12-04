'use client'
import { Button } from '@/components/shadcn/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
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
    const item = contentData?.data?.items?.[0]
    if (!item) {
      router.push(`/${locale}/admin/lesson/${lessonId}/section/${sectionId}`)
      return
    }
    if (item.contentType === ContentType.TEXT) {
      router.push(`/${locale}/admin/lesson/${lessonId}/section/${sectionId}/content/${item.id}`)
      return
    }
    if (item.contentType === ContentType.QUIZ) {
      const quizId = (item as any).quizId
      router.push(`/${locale}/admin/lesson/${lessonId}/section/${sectionId}/quiz/${quizId}`)
      return
    }
    if (item.contentType === ContentType.ASSIGNMENT) {
      const assignmentId = (item as any).assignmentId
      router.push(`/${locale}/admin/lesson/${lessonId}/section/${sectionId}/assignment/${assignmentId}`)
      return
    }
  }

  const item = contentData?.data?.items?.[0]

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogTitle className='flex items-center justify-between'>
          <div>{t('detail.title')}</div>
          <div className='mr-5'>
            {contentData?.data?.items?.length ? (
              <Button variant={'outline'} className='hover:bg-gray-200' onClick={handleEditContent}>
                {tc('button.update')}
              </Button>
            ) : null}
          </div>
        </DialogTitle>
        <hr />

        <ScrollArea className='h-[60vh] w-[70vw] max-w-6xl'>
          {isLoading ? (
            <div className='flex items-center justify-center'>
              <LoadingComponent size={150} />
            </div>
          ) : (
            <ContentDetail item={item} sectionId={sectionId} />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
