import NoteBlockComponent from './NoteBlockComponent'
import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

export const NoteBlock = Node.create({
  name: 'noteBlock',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      title: { default: '' },
      content: { default: '' }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="note-block"]',
        getAttrs: (el) => {
          const element = el as HTMLElement
          return {
            title: element.getAttribute('data-title') || '',
            content: element.getAttribute('data-content') || ''
          }
        }
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      {
        'data-type': 'note-block',
        'data-title': HTMLAttributes.title || '',
        'data-content': HTMLAttributes.content || ''
      }
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(NoteBlockComponent)
  }
})
