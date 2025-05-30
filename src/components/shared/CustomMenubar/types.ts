export type MenubarItemType = 'item' | 'checkbox' | 'radio' | 'sub' | 'separator'

export interface MenubarBaseItem {
  type: MenubarItemType
  label?: string
  shortcut?: string
  disabled?: boolean
  inset?: boolean
  onClick?: () => void
}

export interface MenubarCheckboxItem extends MenubarBaseItem {
  type: 'checkbox'
  checked?: boolean
}

export interface MenubarRadioGroup {
  type: 'radio'
  value: string
  options: { value: string; label: string }[]
}

export interface MenubarSubItem extends MenubarBaseItem {
  type: 'sub'
  items: MenubarConfig[]
}

export interface MenubarSeparator {
  type: 'separator'
}

export type MenubarConfig =
  | MenubarBaseItem
  | MenubarCheckboxItem
  | MenubarRadioGroup
  | MenubarSubItem
  | MenubarSeparator

export interface MenubarMenuGroup {
  label: string
  items: MenubarConfig[]
}
