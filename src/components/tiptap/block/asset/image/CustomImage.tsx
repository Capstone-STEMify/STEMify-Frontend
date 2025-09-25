import CustomImageNodeView from '@/components/tiptap/block/asset/image/CustomImageNodeView'
import Image from '@tiptap/extension-image'
import { ReactNodeViewRenderer } from '@tiptap/react'

export const CustomImage = Image.extend({
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('src'),
        renderHTML: (attributes: Record<string, any>) => {
          if (!attributes.src) return {}
          return { src: attributes.src }
        }
      },
      alt: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('alt'),
        renderHTML: (attributes: Record<string, any>) => {
          if (!attributes.alt) return {}
          return { alt: attributes.alt }
        }
      },
      title: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('title'),
        renderHTML: (attributes: Record<string, any>) => {
          if (!attributes.title) return {}
          return { title: attributes.title }
        }
      },
      width: {
        default: '480px',
        parseHTML: (element: HTMLElement) => element.getAttribute('width') || '480px',
        renderHTML: (attributes: Record<string, any>) => {
          return { width: attributes.width }
        }
      },
      height: {
        default: '270px',
        parseHTML: (element: HTMLElement) => element.getAttribute('height') || '270px',
        renderHTML: (attributes: Record<string, any>) => {
          return { height: attributes.height }
        }
      },
      textAlign: {
        default: 'left',
        parseHTML: (element: HTMLElement) => element.style.textAlign || 'left',
        renderHTML: (attributes: Record<string, any>) => {
          return { style: `text-align:${attributes.textAlign}` }
        }
      }
    }
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return [
      'img',
      {
        ...HTMLAttributes,
        class: 'inline align-middle max-w-full h-auto'
      }
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomImageNodeView)
  }
})
