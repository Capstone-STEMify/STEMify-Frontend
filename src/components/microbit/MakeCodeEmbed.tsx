'use client'

import { useRef, useState } from 'react'
import type { MakeCodeFrameDriver, MakeCodeProject, EditorWorkspaceSaveRequest } from '@microbit/makecode-embed'
import { MakeCodeFrame } from '@microbit/makecode-embed/react'

export default function MakeCodeEditor() {
  const frameRef = useRef<MakeCodeFrameDriver | null>(null)

  const [savedProject, setSavedProject] = useState<MakeCodeProject | null>(null)

  const initialProjects: MakeCodeProject[] = savedProject ? [savedProject] : []

  return (
    <div style={{ height: '80vh' }}>
      <MakeCodeFrame
        ref={frameRef}
        controller={1}
        controllerId='stemify-microbit-editor'
        allow='usb; autoplay; camera; microphone;'
        initialProjects={async () => initialProjects}
        onEditorContentLoaded={() => {
          console.log('MakeCode is ready')
        }}
        onWorkspaceSave={(e: EditorWorkspaceSaveRequest) => {
          setSavedProject(e.project)
          console.log('Saved project:', e.project)
        }}
        style={{ width: '100%', height: '100%', border: 0 }}
      />
    </div>
  )
}
