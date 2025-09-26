import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { SPopover } from '@/components/shared/SPopover'
import { useEditorCtx } from '@/components/tiptap/EditorContext'
import {
  useDeleteListLessonAssetsMutation,
  useGetListLessonAssetsQuery
} from '@/features/resource/lesson-asset/api/lessonAssetApi'
import { toggleSelect } from '@/features/resource/lesson-asset/slice/lessonAssetSelectionSliice'
import { LessonAssetSliceParams, LessonAssetType } from '@/features/resource/lesson-asset/types/lessonAsest.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { Download, EllipsisVertical, Info, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

export default function ImageAssets() {
  const editor = useEditorCtx()

  const { lessonId } = useParams()
  const dispatch = useAppDispatch()
  const selectedIds = useAppSelector((state) => state.lessonAssetSelection.selectedIds)

  const lessonAsset = useAppSelector((state) => state.lessonAsset)
  const queryParams: LessonAssetSliceParams = {
    pageNumber: lessonAsset.pageNumber,
    pageSize: lessonAsset.pageSize,
    type: LessonAssetType.IMAGE
  }

  const { data, isLoading: loadingImages } = useGetListLessonAssetsQuery({
    lessonId: Number(lessonId),
    params: queryParams
  })

  const [deleteImage, { isLoading: deletingImages }] = useDeleteListLessonAssetsMutation()

  const handleDeleteImages = async (ids: number[]) => {
    if (ids.length === 0) return
    try {
      await deleteImage({
        lessonId: Number(lessonId),
        ids
      }).unwrap()
      toast.success('Deleted images successfully')
    } catch {
      toast.error('Failed to delete images')
    }
  }

  if (loadingImages) {
    return <div className='text-sm text-gray-500'>Loading images...</div>
  }

  if (!data) {
    return <div className='text-sm text-gray-500'>No images uploaded yet</div>
  }

  if (!editor) {
    return <div className='p-4 text-sm text-red-500'>Something wrong, please contact support</div>
  }

  return (
    <div className='relative h-full'>
      {deletingImages && (
        <div className='absolute inset-0 z-10 flex items-center justify-center bg-white/70'>
          <LoadingComponent textShow text='Deleting images...' />
        </div>
      )}

      <div className='grid grid-cols-2 gap-2'>
        {data.data.items.map((asset) => (
          <div
            key={asset.id}
            className='relative w-full overflow-hidden rounded-md border hover:ring-2 hover:ring-purple-400'
            style={{ aspectRatio: `${asset.width || 1}/${asset.height || 1}` }}
            onDoubleClick={() => {
              editor.chain().focus().setImage({ src: asset.assetUrl, alt: asset.name }).run()
            }}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', asset.assetUrl)
            }}
          >
            {/* Checkbox chọn ảnh */}
            <input
              type='checkbox'
              checked={selectedIds.includes(asset.id)}
              onChange={() => dispatch(toggleSelect(asset.id))}
              className='absolute top-2 left-2 z-10 h-4 w-4 cursor-pointer accent-purple-500'
              onClick={(e) => e.stopPropagation()}
            />

            {/* Preview ảnh */}
            <Image src={asset.assetUrl} alt={asset.name || 'Image'} sizes='200px' fill className='object-contain' />

            {/* Popover menu */}
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
                <div className='flex cursor-pointer items-center gap-2 rounded px-3 py-2 hover:bg-gray-100'>
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
                  onClick={() => handleDeleteImages([asset.id])}
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
