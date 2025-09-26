import LinkButtonBlockComponent from '@/components/tiptap/block/button/link/LinkButtonBlockComponent'
import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
export const LinkButtonBlock = Node.create({
  name: 'linkButtonBlock',
  group: 'block',
  atom: true,
  defining: true,
  isolating: true,

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
      'div',
      {
        class: 'w-full text-center my-6',
        'data-type': 'link-button-block',
        'data-label': HTMLAttributes.label,
        'data-url': HTMLAttributes.url
      },
      [
        'a',
        {
          // 'data-label': HTMLAttributes.label,
          // 'data-url': HTMLAttributes.url,
          href: HTMLAttributes.url || '#',
          target: '_blank',
          rel: 'noopener noreferrer',
          class:
            'inline-block rounded-lg bg-amber-custom-400 px-4 py-2 font-semibold text-black no-underline shadow-md hover:bg-amber-500'
        },
        HTMLAttributes.label
      ]
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(LinkButtonBlockComponent)
  }
})
