import GuideContent from '@/features/resource/content/components/sidebar/panel/guide/GuideContent'
import TemplateContent from '@/features/resource/content/components/sidebar/panel/template/TemplateContent'
import UploadContent from '@/features/resource/content/components/sidebar/panel/upload/UploadContent'
import { IconHelpSquareRounded, IconTemplate, IconUpload } from '@tabler/icons-react'

export type PanelKey = 'guide' | 'upload' | 'template'

export const sidebarItems = [
  // { key: 'elements' as PanelKey, icon: IconCategory2, label: 'Elements' },
  { key: 'guide' as PanelKey, icon: IconHelpSquareRounded, label: 'Guide' },
  { key: 'upload' as PanelKey, icon: IconUpload, label: 'Upload' },
  { key: 'template' as PanelKey, icon: IconTemplate, label: 'Templates' }
]
export const PanelContent = ({ activePanel }: { activePanel: PanelKey | null }) => {
  switch (activePanel) {
    // case 'elements':
    //   return <ElementContent />
    case 'guide':
      return <GuideContent />
    case 'upload':
      return <UploadContent />
    case 'template':
      return <TemplateContent />
    default:
      return null
  }
}
