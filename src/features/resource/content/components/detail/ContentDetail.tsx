import { Button } from '@/components/shadcn/button'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import TiptapViewer from '@/components/tiptap/TiptapViewer'
import { useSearchContentQuery } from '@/features/resource/content/api/contentApi'
import { ContentType } from '@/features/resource/content/types/content.type'
import { useSearchQuizQuery } from '@/features/resource/quiz/api/quizApi'
import QuizViewer from '@/features/resource/quiz/components/builder/view/QuizViewer'
import { useModal } from '@/providers/ModalProvider'
import { normalizeMarkdown } from '@/utils/index'
import { BookPlus, FilePlus } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'

type ContentDetailProps = {
  sectionId: number
}

export default function ContentDetail({ sectionId }: ContentDetailProps) {
  const { lessonId } = useParams()
  const t = useTranslations('content')
  const { data: contentData, isLoading } = useSearchContentQuery({ sectionId })
  // const { data: quizData } = useSearchQuizQuery({ sectionId })
  const { closeModal } = useModal()
  const router = useRouter()
  const locale = useLocale()

  const handleCreateContent = () => {
    closeModal()
    router.push(`/${locale}/admin/lesson/${lessonId}/section/${sectionId}`)
  }

  const handleCreateQuiz = () => {
    closeModal()
    router.push(`/${locale}/admin/lesson/${lessonId}/section/${sectionId}/quiz/${contentData?.data.items[0].id}`)
  }

  if (isLoading)
    return (
      <div className='flex items-center justify-center'>
        <LoadingComponent size={150} />
      </div>
    )
  if (!contentData?.data?.items?.length || !contentData)
    return (
      <div className='flex flex-col items-center justify-center space-y-4 rounded-2xl border bg-gray-50 py-10 text-center'>
        <h3 className='text-lg font-semibold text-gray-800'>{t('detail.noData')}</h3>
        <p className='text-gray-500'>{t('detail.noDataDetail')}</p>
        <div className='flex gap-2'>
          <Button onClick={handleCreateContent} className='bg-amber-custom-400 flex items-center gap-2'>
            <FilePlus className='h-4 w-4' />
            {t('form.title.create')}
          </Button>
          <Button onClick={handleCreateQuiz} className='bg-sky-custom-300 flex items-center gap-2'>
            <BookPlus className='h-4 w-4' />
            {t('form.title.createQuiz')}
          </Button>
        </div>
      </div>
    )

  return (
    <div>
      {contentData.data.items[0].contentType === ContentType.TEXT ? (
        <TiptapViewer content={normalizeMarkdown(contentData?.data.items[0].contentBody)} />
      ) : (
        <QuizViewer quiz={contentData.data.items[0]} />
      )}
    </div>
  )
}
