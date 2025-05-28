import { metadata } from 'app/layout'
import React from 'react'

metadata.title = 'Excalidraw Layout'

export default function ExcalidrawLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div>{children}</div>
}
