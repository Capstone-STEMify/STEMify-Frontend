import { Editor, useEditorState } from '@tiptap/react'

export function useMarkActive(editor: Editor | null, mark: string) {
  return useEditorState({
    editor,
    selector: () => editor?.isActive(mark)
  })
}

export function useNodeActive(editor: Editor | null, node: string, attrs?: Record<string, any>) {
  return useEditorState({
    editor,
    selector: () => editor?.isActive(node, attrs)
  })
}
