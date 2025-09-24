import { SPopover } from '@/components/shared/SPopover'
import {
  useDeleteListLessonAssetsMutation,
  useGetListLessonAssetsQuery
} from '@/features/resource/lesson-asset/api/lessonAssetApi'
import { clearSelection, toggleSelect } from '@/features/resource/lesson-asset/slice/lessonAssetSelectionSliice'
import { LessonAssetSliceParams, LessonAssetType } from '@/features/resource/lesson-asset/types/lessonAsest.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { EllipsisVertical, Download, Trash2, Info, FileText, FileSpreadsheet, FileArchive, X } from 'lucide-react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

export default function DesignAssets() {
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
    type: LessonAssetType.RAW
  }

  const { data } = useGetListLessonAssetsQuery({
    lessonId: Number(lessonId),
    params: queryParams
  })

  if (!data) {
    return <div className='text-sm text-gray-500'>No designs uploaded yet</div>
  }

  const getFileExtension = (filename: string) => {
    const parts = filename.split('.')
    return parts.length > 1 ? parts.pop()?.toLowerCase() : ''
  }

  const getFileIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return <FileText className='text-red-500' size={40} />
      case 'doc':
      case 'docx':
        return <FileText className='text-blue-500' size={40} />
      case 'xls':
      case 'xlsx':
        return <FileSpreadsheet className='text-green-500' size={40} />
      case 'ppt':
      case 'pptx':
        return <FileText className='text-orange-500' size={40} />
      case 'zip':
      case 'rar':
        return <FileArchive className='text-yellow-500' size={40} />
      default:
        return <FileText className='text-gray-500' size={40} />
    }
  }

  return (
    <div className='relative h-full'>
      <div className='grid grid-cols-2 gap-4'>
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
                    <div className='flex cursor-pointer items-center gap-2 rounded px-3 py-2 hover:bg-gray-100'>
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
    </div>
  )
}
