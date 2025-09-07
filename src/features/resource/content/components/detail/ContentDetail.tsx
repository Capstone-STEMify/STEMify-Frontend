import TiptapViewer from '@/components/tiptap/TiptapViewer'
import { useSearchContentQuery } from '@/features/resource/content/api/contentApi'
import { normalizeMarkdown } from '@/utils/index'

type ContentDetailProps = {
  sectionId: number
}

export default function ContentDetail({ sectionId }: ContentDetailProps) {
  const { data: contentData, isLoading } = useSearchContentQuery({ sectionId })

  if (isLoading) return <div>Loading...</div>
  if (!contentData?.data?.items?.length) return <div>No content found</div>

  return (
    <div>
      {/* temporarily get the first content */}
      <TiptapViewer content={normalizeMarkdown(contentData?.data.items[0].contentBody)} />
    </div>
  )
}
