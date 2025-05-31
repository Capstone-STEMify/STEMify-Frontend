'use client'

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger
} from '@/components/shadcn/menubar'
import { MenubarMenuGroup, MenubarConfig } from './types'

interface Props {
  menus: MenubarMenuGroup[]
}

export default function CustomMenubar({ menus }: Props) {
  const renderItem = (item: MenubarConfig, key: number) => {
    // separator line
    if (item.type === 'separator') return <MenubarSeparator key={key} />

    // checkbox items
    if (item.type === 'checkbox') {
      return (
        <MenubarCheckboxItem key={key} checked={(item as any).checked} disabled={item.disabled}>
          {item.label}
        </MenubarCheckboxItem>
      )
    }

    // radio items
    if (item.type === 'radio') {
      const radio = item as any
      return (
        <MenubarRadioGroup key={key} value={radio.value}>
          {radio.options.map((opt: any) => (
            <MenubarRadioItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenubarRadioItem>
          ))}
        </MenubarRadioGroup>
      )
    }

    // submenus
    if (item.type === 'sub') {
      const sub = item as any
      return (
        <MenubarSub key={key}>
          <MenubarSubTrigger>{sub.label}</MenubarSubTrigger>
          <MenubarSubContent>{sub.items.map((subItem: any, i: number) => renderItem(subItem, i))}</MenubarSubContent>
        </MenubarSub>
      )
    }

    // regular items
    return (
      <MenubarItem key={key} onClick={item.onClick} disabled={item.disabled} inset={item.inset}>
        {item.label}
        {item.shortcut && <MenubarShortcut>{item.shortcut}</MenubarShortcut>}
      </MenubarItem>
    )
  }

  return (
    <Menubar>
      {menus.map((menu, idx) => (
        <MenubarMenu key={idx}>
          <MenubarTrigger>{menu.label}</MenubarTrigger>
          <MenubarContent>{menu.items.map((item, i) => renderItem(item, i))}</MenubarContent>
        </MenubarMenu>
      ))}
    </Menubar>
  )
}
