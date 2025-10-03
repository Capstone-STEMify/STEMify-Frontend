import GuideContent from '@/features/resource/content/components/sidebar/panel/guide/GuideContent'
import TemplateContent from '@/features/resource/content/components/sidebar/panel/template/TemplateContent'
import UploadContent from '@/features/resource/content/components/sidebar/panel/upload/UploadContent'
import DocumentAssetsDetail from '@/features/resource/lesson-asset/components/document/DocumentAssetsDetail'
import ImageAssetDetail from '@/features/resource/lesson-asset/components/image/ImageAssetDetail'
import VideoAssetsDetail from '@/features/resource/lesson-asset/components/video/VideoAssetsDetail'
import { useAppSelector } from '@/hooks/redux-hooks'
import { IconHelpSquareRounded, IconTemplate, IconUpload } from '@tabler/icons-react'

export type PanelKey = 'guide' | 'upload' | 'template' | 'imageAssetDetail' | 'documentAssetDetail' | 'videoAssetDetail'

export const sidebarItems = [
  { key: 'guide' as PanelKey, icon: IconHelpSquareRounded, label: 'Guide' },
  { key: 'upload' as PanelKey, icon: IconUpload, label: 'Upload' },
  { key: 'template' as PanelKey, icon: IconTemplate, label: 'Templates' }
]
export const PanelContent = () => {
  const activePanel = useAppSelector((state) => state.tiptap.activePanel)
  switch (activePanel) {
    case 'guide':
      return <GuideContent />
    case 'upload':
      return <UploadContent />
    case 'template':
      return <TemplateContent />
    case 'imageAssetDetail':
      return <ImageAssetDetail />
    case 'documentAssetDetail':
      return <DocumentAssetsDetail />
    case 'videoAssetDetail':
      return <VideoAssetsDetail />
    default:
      return null
  }
}
