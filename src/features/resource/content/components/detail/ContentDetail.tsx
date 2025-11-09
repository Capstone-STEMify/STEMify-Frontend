import { Button } from '@/components/shadcn/button'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import TiptapViewer from '@/components/tiptap/TiptapViewer'
import AssignmentViewer from '@/features/assignment/components/detail/AssignmentViewer'
import { useSearchContentQuery } from '@/features/resource/content/api/contentApi'
import { Content, ContentType, QuizContent } from '@/features/resource/content/types/content.type'
import QuizViewer from '@/features/resource/quiz/components/viewer/QuizViewer'
import { useModal } from '@/providers/ModalProvider'
import { normalizeMarkdown } from '@/utils/index'
import { BookPlus, FilePlus, UploadCloud } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'

type ContentDetailProps = {
  sectionId?: number
  item?: Content
}

export default function ContentDetail({ item, sectionId }: ContentDetailProps) {
  const { lessonId } = useParams()
  const t = useTranslations('content')
  // const { data: contentData, isLoading } = useSearchContentQuery({ sectionId: sectionId }, { skip: !item?.id })
  const { closeModal, openModal } = useModal()
  const router = useRouter()
  const locale = useLocale()

  const handleCreateContent = () => {
    closeModal()
    router.push(`/${locale}/admin/lesson/${lessonId}/section/${sectionId}`)
  }

  const handleCreateQuiz = () => {
    closeModal()
    router.push(`/${locale}/admin/lesson/${lessonId}/section/${sectionId}/quiz/question`)
  }

  const handleCreateAssignment = () => {
    closeModal()
    router.push(`/${locale}/admin/lesson/${lessonId}/section/${sectionId}/assignment`)
  }

  // Nếu không có data
  if (!item)
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
          <Button onClick={handleCreateAssignment} className='flex items-center gap-2 bg-green-500'>
            <UploadCloud className='h-4 w-4' />
            {t('form.title.createAssignment')}
          </Button>
        </div>
      </div>
    )

  // Render theo loại nội dung
  const renderContent = () => {
    switch (item.contentType) {
      case ContentType.TEXT:
        return <TiptapViewer content={normalizeMarkdown(item.contentBody)} />
      case ContentType.QUIZ:
        return <QuizViewer quiz={item as QuizContent} isShowQuestionAnswer />
      case ContentType.ASSIGNMENT:
        return <AssignmentViewer />
      default:
        return <div className='text-sm text-gray-500'>{t('detail.unsupportedType')}</div>
    }
  }

  return <div>{renderContent()}</div>
}
