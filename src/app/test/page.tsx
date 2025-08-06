'use client'

import Sidebar from 'app/test/Sidebar'
import Workspace3D from 'app/test/Workspace3D'
import { useState } from 'react'

export default function Page() {
  const [components, setComponents] = useState<any[]>([])

  const handleAdd = (comp: any) => {
    setComponents((prev) => [...prev, comp])
  }

  return (
    <div className='flex h-screen'>
      <Sidebar onAdd={handleAdd} />
      <div className='flex-1'>
        <Workspace3D components={components} />
      </div>
    </div>
  )
}
