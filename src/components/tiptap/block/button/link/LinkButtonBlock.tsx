import LinkButtonBlockComponent from '@/components/tiptap/block/button/link/LinkButtonBlockComponent'
import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

export const LinkButtonBlock = Node.create({
  name: 'linkButtonBlock',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      label: { default: 'CREATE IN MAKECODE' },
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
            label: element.getAttribute('data-label') || 'CREATE IN MAKECODE',
            url: element.getAttribute('data-url') || ''
          }
        }
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      {
        'data-type': 'link-button-block',
        'data-label': HTMLAttributes.label,
        'data-url': HTMLAttributes.url
      }
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(LinkButtonBlockComponent)
  }
})
