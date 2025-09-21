import LinkButtonBlockComponent from '@/components/tiptap/block/button/link/LinkButtonBlockComponent'
import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

export const LinkButtonBlock = Node.create({
  name: 'linkButtonBlock',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      label: { default: 'EXPLORE NOW' },
      url: { default: '' }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="link-button-block"]',
        getAttrs: (el) => {
          const element = el as HTMLElement
          return {
            label: element.getAttribute('data-label') || 'EXPLORE NOW',
            url: element.getAttribute('data-url') || ''
          }
        }
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'button',
      {
        'data-type': 'link-button-block',
        'data-label': HTMLAttributes.label,
        'data-url': HTMLAttributes.url,
        class: 'bg-amber-custom-400 font-semibold text-black shadow-md hover:bg-amber-500'
      },
      HTMLAttributes.label
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer(LinkButtonBlockComponent)
  }
})
