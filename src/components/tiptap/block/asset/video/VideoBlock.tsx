import VideoBlockComponent from '@/components/tiptap/block/asset/video/VideoBlockComponent'
import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

export const Video = Node.create({
  name: 'video',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      width: {
        default: '480px',
        parseHTML: (el: HTMLElement) => el.getAttribute('width') || '480px',
        renderHTML: (attrs) => ({ width: attrs.width })
      },
      height: {
        default: '270px',
        parseHTML: (el: HTMLElement) => el.getAttribute('height') || '270px',
        renderHTML: (attrs) => ({ height: attrs.height })
      }
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
        style: 'display:block; margin:0 auto; max-width:100%'
      })
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoBlockComponent)
  }
})
