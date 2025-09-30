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
        'data-content': HTMLAttributes.content || '',
        class: 'rounded-md my-6 border bg-yellow-50'
      },
      [
        'div',
        { class: 'flex items-center justify-between rounded-t-md bg-sky-100 px-4 py-2' },
        [
          'div',
          { class: 'flex items-center gap-2 font-semibold text-blue-700' },
          ['span', {}, '🎓'],
          ['span', {}, 'Ghi chú giáo viên']
        ],
        ['span', { class: 'text-xs text-gray-500 italic' }, 'Học sinh sẽ không thấy ghi chú này']
      ],
      [
        'div',
        { class: 'px-6 py-4 text-sm text-gray-700' },
        HTMLAttributes.title ? ['h3', { class: 'font-bold' }, HTMLAttributes.title] : '',
        ['div', { class: 'whitespace-pre-line' }, HTMLAttributes.content || '']
      ]
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer(NoteBlockComponent)
  }
})
