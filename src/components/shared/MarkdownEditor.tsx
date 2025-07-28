import React from 'react'
import MDEditor from '@uiw/react-md-editor'

type MarkdownEditorProps = {
  value: string | undefined
  onChange: (value: string | undefined) => void
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <div data-color-mode='light' className='container'>
      <MDEditor value={value} onChange={onChange} height={500} />
    </div>
  )
}
