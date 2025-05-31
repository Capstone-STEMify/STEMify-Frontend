import CustomMenubar from './CustomMenubar'
import { MenubarMenuGroup } from './types'

const menuData: MenubarMenuGroup[] = [
  {
    label: 'File',
    items: [
      { type: 'item', label: 'New Tab', shortcut: '⌘T' },
      { type: 'item', label: 'New Window', shortcut: '⌘N' },
      { type: 'item', label: 'New Incognito Window', disabled: true },
      { type: 'separator' },
      {
        type: 'sub',
        label: 'Share',
        items: [
          { type: 'item', label: 'Email link' },
          { type: 'item', label: 'Messages' },
          { type: 'item', label: 'Notes' }
        ]
      },
      { type: 'separator' },
      { type: 'item', label: 'Print...', shortcut: '⌘P' }
    ]
  },
  {
    label: 'View',
    items: [
      { type: 'checkbox', label: 'Always Show Bookmarks Bar' },
      { type: 'checkbox', label: 'Always Show Full URLs', checked: true },
      { type: 'separator' },
      { type: 'item', label: 'Reload', shortcut: '⌘R', inset: true },
      { type: 'item', label: 'Force Reload', shortcut: '⇧⌘R', inset: true, disabled: true },
      { type: 'separator' },
      { type: 'item', label: 'Toggle Fullscreen', inset: true }
    ]
  },
  {
    label: 'Profiles',
    items: [
      {
        type: 'radio',
        value: 'benoit',
        options: [
          { value: 'andy', label: 'Andy' },
          { value: 'benoit', label: 'Benoit' },
          { value: 'luis', label: 'Luis' }
        ]
      },
      { type: 'separator' },
      { type: 'item', label: 'Edit...', inset: true },
      { type: 'item', label: 'Add Profile...', inset: true }
    ]
  }
]

export default function MenuExample() {
  return <CustomMenubar menus={menuData} />
}
