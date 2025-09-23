import ElementContent from '@/features/resource/content/components/sidebar/panel/ElementContent'
import TextContent from '@/features/resource/content/components/sidebar/panel/TextContent'
import UploadContent from '@/features/resource/content/components/sidebar/panel/UploadContent'
import { IconCategory2, IconTools, IconUpload } from '@tabler/icons-react'

export type PanelKey = 'elements' | 'text' | 'upload'

export const sidebarItems = [
  { key: 'elements' as PanelKey, icon: IconCategory2, label: 'Elements' },
  { key: 'text' as PanelKey, icon: IconTools, label: 'Text' },
  { key: 'upload' as PanelKey, icon: IconUpload, label: 'Upload' }
]
export const PanelContent = ({ activePanel }: { activePanel: PanelKey | null }) => {
  switch (activePanel) {
    case 'elements':
      return <ElementContent />
    case 'text':
      return <TextContent />
    case 'upload':
      return <UploadContent />
    default:
      return null
  }
}
