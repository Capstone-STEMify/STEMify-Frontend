import { Node, mergeAttributes } from '@tiptap/core'

export const Video = Node.create({
  name: 'videoBlock',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: { default: null }
    }
  },

  parseHTML() {
    return [{ tag: 'video' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'video',
      mergeAttributes(HTMLAttributes, {
        controls: true,
        style: 'max-width: 100%'
      })
    ]
  }
})
