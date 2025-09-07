import { Button } from '@/components/shadcn/button'
import TiptapViewer from '@/components/tiptap/TiptapViewer'
import { useSearchContentQuery } from '@/features/resource/content/api/contentApi'
import { useModal } from '@/providers/ModalProvider'
import { normalizeMarkdown } from '@/utils/index'
import { FilePlus } from 'lucide-react'

type ContentDetailProps = {
  sectionId: number
}

export default function ContentDetail({ sectionId }: ContentDetailProps) {
  const { data: contentData, isLoading } = useSearchContentQuery({ sectionId })
  const { openModal } = useModal()

  const handleCreateContent = () => {
    openModal('upsertContent')
  }

  if (isLoading) return <div>Loading...</div>
  if (!contentData?.data?.items?.length)
    return (
      <div className='flex flex-col items-center justify-center space-y-4 rounded-2xl border bg-gray-50 py-10 text-center'>
        <h3 className='text-lg font-semibold text-gray-800'>No content found</h3>
        <p className='text-gray-500'>You haven’t created any content yet.</p>
        <Button onClick={handleCreateContent} className='bg-amber-custom-400 flex items-center gap-2'>
          <FilePlus className='h-4 w-4' />
          Create Content
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
