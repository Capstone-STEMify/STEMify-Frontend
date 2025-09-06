import TiptapViewer from '@/components/tiptap/TiptapViewer'
import { useGetContentByIdQuery } from '@/features/resource/content/api/contentApi'
import { normalizeMarkdown } from '@/utils/index'
import { useParams } from 'next/navigation'

type ContentDetailProps = {
  contentId?: number
}

export default function ContentDetail({ contentId }: ContentDetailProps) {
  const { data } = useGetContentByIdQuery(contentId!, { skip: !contentId })

  if (!data) return <div>Loading...</div>

  return (
    <div>
      <TiptapViewer content={normalizeMarkdown(data?.data.contentName)} />
    </div>
  )
}
