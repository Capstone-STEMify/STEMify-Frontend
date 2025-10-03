import { SPopover } from '@/components/shared/SPopover'
import { useEditorCtx } from '@/components/tiptap/EditorContext'
import { setActivePanel } from '@/components/tiptap/slice/tiptapSlice'
import {
  useGetListLessonAssetsQuery,
  useDeleteListLessonAssetsMutation
} from '@/features/resource/lesson-asset/api/lessonAssetApi'
import { toggleSelect } from '@/features/resource/lesson-asset/slice/lessonAssetSelectionSliice'
import { LessonAssetSliceParams, LessonAssetType } from '@/features/resource/lesson-asset/types/lessonAsest.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { EllipsisVertical, Download, Trash2, Info } from 'lucide-react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

export default function VideoAssets() {
  const editor = useEditorCtx()
  const { lessonId } = useParams()
  const dispatch = useAppDispatch()
  const selectedIds = useAppSelector((state) => state.lessonAssetSelection.selectedIds)

  const handleToggle = (id: number) => {
    dispatch(toggleSelect(id))
  }

  const lessonAsset = useAppSelector((state) => state.lessonAsset)
  const queryParams: LessonAssetSliceParams = {
    pageNumber: lessonAsset.pageNumber,
    pageSize: lessonAsset.pageSize,
    type: LessonAssetType.VIDEO
  }

  const { data } = useGetListLessonAssetsQuery({
    lessonId: Number(lessonId),
    params: queryParams
  })

  const [deleteVideo] = useDeleteListLessonAssetsMutation()

  const handleDelete = async (id: number) => {
    try {
      await deleteVideo({ lessonId: Number(lessonId), ids: [id] }).unwrap()
      toast.success('Deleted video successfully')
    } catch {
      toast.error('Failed to delete video')
    }
  }

  if (!data) {
    return <div className='text-sm text-gray-500'>No videos uploaded yet</div>
  }

  if (!editor) {
    return <div className='p-4 text-sm text-red-500'>Something wrong, please contact support</div>
  }

  return (
    <div className='relative h-full'>
      <div className='grid grid-cols-2 gap-4'>
        {data.data.items.map((asset) => (
          <div
            key={asset.id}
            className='relative aspect-video w-full overflow-hidden rounded-lg border bg-black transition hover:shadow-md'
            onDoubleClick={() => {
              editor
                .chain()
                .focus()
                .insertContent({
                  type: 'video',
                  attrs: { src: asset.assetUrl, title: asset.name }
                })
                .run()
            }}
          >
            {/* Checkbox chọn video */}
            <input
              type='checkbox'
              checked={selectedIds.includes(asset.id)}
              onChange={() => handleToggle(asset.id)}
              className='absolute top-2 left-2 z-10 h-4 w-4 cursor-pointer accent-purple-500'
            />

            {/* Preview video */}
            <video
              src={asset.assetUrl}
              className='h-full w-full rounded-lg object-cover'
              controls={false}
              preload='metadata'
            />

            {/* Popover actions */}
            <SPopover
              trigger={
                <button className='absolute top-2 right-2 flex items-center justify-center rounded-full bg-white/80 p-1 text-gray-700 shadow hover:bg-white'>
                  <EllipsisVertical size={14} />
                </button>
              }
              side='right'
              align='start'
            >
              <div className='flex flex-col text-sm'>
                <div
                  className='flex cursor-pointer items-center gap-2 rounded px-3 py-2 hover:bg-gray-100'
                  onClick={() => dispatch(setActivePanel({ panel: 'assetDetail', assetId: asset.id }))}
                >
                  <Info size={14} /> Details
                </div>
                <a
                  href={asset.assetUrl}
                  download
                  className='flex cursor-pointer items-center gap-2 rounded px-3 py-2 hover:bg-gray-100'
                >
                  <Download size={14} />
                  <span>Download</span>
                </a>
                <div
                  onClick={() => handleDelete(asset.id)}
                  className='flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-red-500 hover:bg-gray-100'
                >
                  <Trash2 size={14} /> Delete
                </div>
              </div>
            </SPopover>
          </div>
        ))}
      </div>
    </div>
  )
}
