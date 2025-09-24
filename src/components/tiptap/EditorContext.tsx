'use client'
import { createContext, useContext } from 'react'
import { Editor } from '@tiptap/react'

const EditorContext = createContext<Editor | null>(null)

export function EditorProvider({ editor, children }: { editor: Editor | null; children: React.ReactNode }) {
  return <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>
}

export function useEditorCtx() {
  return useContext(EditorContext)
}
