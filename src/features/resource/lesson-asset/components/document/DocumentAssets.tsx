import { SPopover } from '@/components/shared/SPopover'
import { setActivePanel } from '@/components/tiptap/slice/tiptapSlice'
import {
  useDeleteListLessonAssetsMutation,
  useGetListLessonAssetsQuery
} from '@/features/resource/lesson-asset/api/lessonAssetApi'
import { clearSelection, toggleSelect } from '@/features/resource/lesson-asset/slice/lessonAssetSelectionSliice'
import { LessonAssetSliceParams, LessonAssetType } from '@/features/resource/lesson-asset/types/lessonAsest.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { EllipsisVertical, Download, Trash2, Info, FileText, FileSpreadsheet, FileArchive, X } from 'lucide-react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

export const getFileIcon = (format: string, size?: number) => {
  size = size || 40
  switch (format) {
    case 'pdf':
      return <FileText className='text-red-500' size={size} />
    case 'doc':
    case 'docx':
      return <FileText className='text-blue-500' size={size} />
    case 'xls':
    case 'xlsx':
      return <FileSpreadsheet className='text-green-500' size={size} />
    case 'ppt':
    case 'pptx':
      return <FileText className='text-orange-500' size={size} />
    case 'zip':
    case 'rar':
      return <FileArchive className='text-yellow-500' size={size} />
    default:
      return <FileText className='text-gray-500' size={size} />
  }
}

export default function DocumentAssets() {
  const { lessonId } = useParams()
  const { openModal } = useModal()
  const dispatch = useAppDispatch()
  const selectedIds = useAppSelector((state) => state.lessonAssetSelection.selectedIds)
  const [deleteFiles, { isLoading: deletingFiles }] = useDeleteListLessonAssetsMutation()

  const handleToggle = (id: number) => {
    dispatch(toggleSelect(id))
  }

  const lessonAsset = useAppSelector((state) => state.lessonAsset)
  const queryParams: LessonAssetSliceParams = {
    pageNumber: lessonAsset.pageNumber,
    pageSize: lessonAsset.pageSize,
    type: LessonAssetType.RAW
  }

  const { data } = useGetListLessonAssetsQuery({
    lessonId: Number(lessonId),
    params: queryParams
  })

  const handleDeleteFiles = async (ids: number[]) => {
    if (ids.length === 0) return
    await deleteFiles({ lessonId: Number(lessonId), ids })
    toast.success('Deleted files successfully')
    dispatch(clearSelection())
  }

  if (!data) {
    return <div className='text-sm text-gray-500'>No documents uploaded yet</div>
  }

  const getFileExtension = (filename: string) => {
    const parts = filename.split('.')
    return parts.length > 1 ? parts.pop()?.toLowerCase() : ''
  }

  return (
    <div className='relative h-full'>
      <div className='mb-10 grid grid-cols-2 gap-4'>
        {data.data.items.map((asset) => {
          const ext = getFileExtension(asset.name || asset.assetUrl)

          return (
            <div key={asset.id} className='group relative flex flex-col items-center'>
              {/* Khung vuông với icon */}
              <div className='relative flex aspect-square w-full items-center justify-center rounded-md border bg-gray-50'>
                {/* Checkbox bên trái trên */}
                <input
                  type='checkbox'
                  checked={selectedIds.includes(asset.id)}
                  onChange={() => handleToggle(asset.id)}
                  className='absolute top-2 left-2 h-4 w-4 cursor-pointer accent-purple-500'
                />

                {getFileIcon(ext!)}

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
                      className='flex cursor-pointer items-center gap-2 rounded px-3 py-2 hover:bg-gray-100'
                      onClick={() =>
                        openModal('confirm', {
                          message: 'Are you sure you want to delete this file?',
                          onConfirm: () => handleDeleteFiles([asset.id])
                        })
                      }
                    >
                      <Trash2 size={14} /> Delete
                    </div>
                  </div>
                </SPopover>
              </div>

              {/* Tên file dưới khung */}
              <p className='mt-2 w-full truncate text-center text-sm font-medium'>{asset.name}</p>
            </div>
          )
        })}
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
    </div>
  )
}
