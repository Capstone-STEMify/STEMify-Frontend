import { ScrollArea } from '@/components/shadcn/scroll-area'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { SPopover } from '@/components/shared/SPopover'
import { useEditorCtx } from '@/components/tiptap/EditorContext'
import { setActivePanel } from '@/components/tiptap/slice/tiptapSlice'
import {
  useDeleteListLessonAssetsMutation,
  useGetListLessonAssetsQuery
} from '@/features/resource/lesson-asset/api/lessonAssetApi'
import { clearSelection, toggleSelect } from '@/features/resource/lesson-asset/slice/lessonAssetSelectionSliice'
import { LessonAssetSliceParams, LessonAssetType } from '@/features/resource/lesson-asset/types/lessonAsest.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { Download, EllipsisVertical, Info, Trash2, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

export default function ImageAssets() {
  const tc = useTranslations('common')
  const tContent = useTranslations('content')
  const editor = useEditorCtx()
  const { openModal } = useModal()
  const { lessonId } = useParams()
  const dispatch = useAppDispatch()
  const selectedIds = useAppSelector((state) => state.lessonAssetSelection.selectedIds)
  const [deleteFiles, { isLoading: deletingFiles }] = useDeleteListLessonAssetsMutation()

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

  const handleDeleteFiles = async (ids: number[]) => {
    if (ids.length === 0) return
    await deleteFiles({ lessonId: Number(lessonId), ids })
    toast.success('Deleted files successfully')
    dispatch(clearSelection())
  }

  if (loadingImages) {
    return <div className='text-sm text-gray-500'>{tContent('loading')}</div>
  }

  if (!data) {
    return <div className='text-sm text-gray-500'>{tContent('noData')}</div>
  }

  if (!editor) {
    return <div className='p-4 text-sm text-red-500'>{tContent('somethingWrong')}</div>
  }
  return (
    <div className='flex h-full flex-col'>
      <ScrollArea className='h-[470px] pb-2'>
        <div className='grid grid-cols-2 gap-2 p-2 px-4'>
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
                e.dataTransfer.clearData()
                e.dataTransfer.setData('text/uri-list', asset.assetUrl)
                e.dataTransfer.setData('text/plain', asset.assetUrl)

                const img = new window.Image()
                img.src = asset.assetUrl
                e.dataTransfer.setDragImage(img, 0, 0)
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
                  <div
                    className='flex cursor-pointer items-center gap-2 rounded px-3 py-2 hover:bg-gray-100'
                    onClick={() => dispatch(setActivePanel({ panel: 'assetDetail', assetId: asset.id }))}
                  >
                    <Info size={14} /> {tc('button.detail')}
                  </div>
                  <a
                    href={asset.assetUrl}
                    download
                    className='flex cursor-pointer items-center gap-2 rounded px-3 py-2 hover:bg-gray-100'
                  >
                    <Download size={14} />
                    <span>{tc('button.download')}</span>
                  </a>
                  <div
                    onClick={() =>
                      openModal('confirm', {
                        message: 'Are you sure you want to delete this file?',
                        onConfirm: () => handleDeleteFiles([asset.id])
                      })
                    }
                    className='flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-red-500 hover:bg-gray-100'
                  >
                    <Trash2 size={14} /> {tc('button.delete')}
                  </div>
                </div>
              </SPopover>
            </div>
          ))}
        </div>

        {selectedIds.length > 0 && (
          <div className='sticky bottom-1 z-10 rounded-4xl border bg-white shadow-md'>
            <div className='flex items-center justify-between px-4 py-2'>
              <span className='text-sm font-medium'>{selectedIds.length} selected</span>
              <div className='flex items-center gap-4'>
                <button className='rounded p-2 hover:bg-gray-100'>
                  <Download size={18} />
                </button>
                <button
                  className='rounded p-2 text-red-500 hover:bg-red-50'
                  onClick={() =>
                    openModal('confirm', {
                      message: 'Are you sure you want to delete these files?',
                      onConfirm: () => handleDeleteFiles(selectedIds)
                    })
                  }
                >
                  <Trash2 size={18} />
                </button>
                <button onClick={() => dispatch(clearSelection())} className='rounded p-2 hover:bg-gray-100'>
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
