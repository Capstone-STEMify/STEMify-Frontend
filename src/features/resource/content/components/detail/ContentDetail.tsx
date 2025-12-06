import { Button } from '@/components/shadcn/button'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import TiptapViewer from '@/components/tiptap/TiptapViewer'
import AssignmentViewer from '@/features/assignment/components/detail/AssignmentViewer'
import { useSearchContentQuery } from '@/features/resource/content/api/contentApi'
import { Content, ContentType, QuizContent } from '@/features/resource/content/types/content.type'
import QuizViewer from '@/features/resource/quiz/components/viewer/QuizViewer'
import { useModal } from '@/providers/ModalProvider'
import { normalizeMarkdown } from '@/utils/index'
import { BookOpen, ClipboardList, FileText } from 'lucide-react'
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
    openModal('createQuiz', { sectionId: Number(sectionId) })
    // router.push(`/${locale}/admin/lesson/${lessonId}/section/${sectionId}/quiz/question`)
  }

  const handleCreateAssignment = () => {
    closeModal()
    // router.push(`/${locale}/admin/lesson/${lessonId}/section/${sectionId}/assignment`)
    openModal('createAssignmentInfo', { sectionId: Number(sectionId) })
  }

  // Nếu không có data
  if (!item)
    return (
      <div className='flex flex-col items-center justify-center space-y-4 rounded-2xl border bg-gray-50 py-10 text-center'>
        <h3 className='text-lg font-semibold text-gray-800'>{t('detail.noData')}</h3>
        <p className='text-gray-500'>{t('detail.noDataDetail')}</p>
        <div className='flex w-full max-w-md flex-col gap-3 px-4'>
          <button
            onClick={handleCreateContent}
            className='hover:border-amber-custom-400 flex items-center gap-3 rounded-lg border bg-white p-4 transition-all hover:bg-amber-50 hover:shadow-md'
          >
            <div className='bg-amber-custom-400 flex h-10 w-10 items-center justify-center rounded-lg'>
              <BookOpen className='h-5 w-5 text-white' />
            </div>
            <span className='font-medium text-gray-800'>{t('form.title.create')}</span>
          </button>

          <button
            onClick={handleCreateQuiz}
            className='hover:border-sky-custom-300 flex items-center gap-3 rounded-lg border bg-white p-4 transition-all hover:bg-sky-50 hover:shadow-md'
          >
            <div className='bg-sky-custom-300 flex h-10 w-10 items-center justify-center rounded-lg'>
              <ClipboardList className='h-5 w-5 text-white' />
            </div>
            <span className='font-medium text-gray-800'>{t('form.title.createQuiz')}</span>
          </button>

          <button
            onClick={handleCreateAssignment}
            className='flex items-center gap-3 rounded-lg border bg-white p-4 transition-all hover:border-green-500 hover:bg-green-50 hover:shadow-md'
          >
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-green-500'>
              <FileText className='h-5 w-5 text-white' />
            </div>
            <span className='font-medium text-gray-800'>{t('form.title.createAssignment')}</span>
          </button>
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
        return <AssignmentViewer item={item as any} />
      default:
        return <div className='text-sm text-gray-500'>{t('detail.unsupportedType')}</div>
    }
  }

  return <div>{renderContent()}</div>
}
