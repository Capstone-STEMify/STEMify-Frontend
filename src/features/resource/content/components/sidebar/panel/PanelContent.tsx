import ElementContent from '@/features/resource/content/components/sidebar/panel/element/ElementContent'
import TemplateContent from '@/features/resource/content/components/sidebar/panel/template/TemplateContent'
import TextContent from '@/features/resource/content/components/sidebar/panel/text/TextContent'
import UploadContent from '@/features/resource/content/components/sidebar/panel/upload/UploadContent'
import { IconCategory2, IconTemplate, IconTools, IconUpload } from '@tabler/icons-react'

export type PanelKey = 'elements' | 'text' | 'upload' | 'template'

export const sidebarItems = [
  { key: 'elements' as PanelKey, icon: IconCategory2, label: 'Elements' },
  { key: 'text' as PanelKey, icon: IconTools, label: 'Text' },
  { key: 'upload' as PanelKey, icon: IconUpload, label: 'Upload' },
  { key: 'template' as PanelKey, icon: IconTemplate, label: 'Templates' }
]
export const PanelContent = ({ activePanel }: { activePanel: PanelKey | null }) => {
  switch (activePanel) {
    case 'elements':
      return <ElementContent />
    case 'text':
      return <TextContent />
    case 'upload':
      return <UploadContent />
    case 'template':
      return <TemplateContent  />
    default:
      return null
  }
}
