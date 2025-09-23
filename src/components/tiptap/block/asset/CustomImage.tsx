import CustomImageNodeView from '@/components/tiptap/block/asset/CustomImageNodeView'
import Image from '@tiptap/extension-image'
import { ReactNodeViewRenderer } from '@tiptap/react'

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      textAlign: {
        default: 'left',
        parseHTML: (element) => element.style.textAlign || 'left',
        renderHTML: (attributes) => {
          return { style: `text-align:${attributes.textAlign}` }
        }
      },
      width: {
        default: 'auto',
        parseHTML: (element) => element.getAttribute('width') || 'auto',
        renderHTML: (attributes) => {
          return { width: attributes.width }
        }
      },
      height: {
        default: 'auto',
        parseHTML: (element) => element.getAttribute('height') || 'auto',
        renderHTML: (attributes) => {
          return { height: attributes.height }
        }
      }
    }
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'img',
      {
        ...HTMLAttributes,
        class: 'inline-block align-middle m-2 max-w-full h-auto'
      }
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomImageNodeView)
  }
})
