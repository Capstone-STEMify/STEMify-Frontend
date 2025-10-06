import GuideContent from '@/features/resource/content/components/sidebar/panel/guide/GuideContent'
import TemplateContent from '@/features/resource/content/components/sidebar/panel/template/TemplateContent'
import UploadContent from '@/features/resource/content/components/sidebar/panel/upload/UploadContent'
import AssetDetail from '@/features/resource/lesson-asset/components/document/AssetDetail'
import { useAppSelector } from '@/hooks/redux-hooks'
import { IconHelpSquareRounded, IconTemplate, IconUpload } from '@tabler/icons-react'

export type PanelKey = 'guide' | 'upload' | 'template' | 'assetDetail'

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
    case 'assetDetail':
      return <AssetDetail />
    default:
      return null
  }
}
