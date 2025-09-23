import Image from '@tiptap/extension-image'

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      isLoading: { default: false },

      width: {
        default: 'auto',
        parseHTML: (element) => element.getAttribute('width') || 'auto',
        renderHTML: (attributes) => {
          if (!attributes.width) return {}
          return { width: attributes.width }
        }
      },
      height: {
        default: 'auto',
        parseHTML: (element) => element.getAttribute('height') || 'auto',
        renderHTML: (attributes) => {
          if (!attributes.height) return {}
          return { height: attributes.height }
        }
      }
    }
  },
  renderHTML({ HTMLAttributes }) {
    if (HTMLAttributes.isLoading) {
      return ['div', { class: 'animate-pulse bg-gray-200 w-32 h-32 rounded' }]
    }
    return ['img', HTMLAttributes]
  }
})
