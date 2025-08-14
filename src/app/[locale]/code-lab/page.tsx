'use client'

import Sidebar from 'app/[locale]/code-lab/Sidebar'
import Workspace3D from 'app/[locale]/code-lab/Workspace3D'
import { useState } from 'react'

export default function Page() {
  const [components, setComponents] = useState<any[]>([])

  const handleAdd = (comp: any) => {
    setComponents((prev) => [...prev, comp])
  }

  const handleExport = () => {
    const json = JSON.stringify(components, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'workspace.json'
    a.click()
  }

  return (
    <div>
      <button onClick={handleExport}>Export JSON</button>
      <div className='flex h-screen'>
        <Sidebar onAdd={handleAdd} />
        <div className='flex-1'>
          <Workspace3D components={components} />
        </div>
      </div>
    </div>
  )
}
