import QuizBlockComponent from './QuizBlockComponent'
import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
export const QuizBlock = Node.create({
  name: 'quizBlock',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      question: { default: '' },
      options: {
        default: [
          { id: 'A', text: '', isCorrect: false },
          { id: 'B', text: '', isCorrect: false }
        ]
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="quiz-block"]',
        getAttrs: (el) => {
          const element = el as HTMLElement
          const optionsAttr = element.getAttribute('data-options')
          let options = []
          try {
            options = optionsAttr ? JSON.parse(optionsAttr) : []
          } catch {
            options = []
          }
          return {
            question: element.getAttribute('data-question') || '',
            options
          }
        }
      }
    ]
  },
  renderHTML({ HTMLAttributes }) {
    const options = Array.isArray(HTMLAttributes.options) ? HTMLAttributes.options : []

    return [
      'div',
      {
        'data-type': 'quiz-block',
        'data-question': HTMLAttributes.question || '',
        'data-options': JSON.stringify(options),
        class: 'my-6'
      },
      [
        'div',
        { class: 'bg-sky-custom-100/50 flex items-center gap-2 rounded-t-3xl p-4' },
        ['span', { class: 'font-semibold' }, HTMLAttributes.question || '']
      ],
      [
        'div',
        { class: 'space-y-2 rounded-b-3xl bg-yellow-100/40 p-4' },
        [
          'div',
          { class: 'flex justify-between' },
          ['div', { class: 'flex items-center gap-2 text-lg font-semibold text-blue-600' }, '🧑‍🏫 Câu trả lời'],
          ['div', { class: 'text-sm text-gray-400 italic' }, 'Học sinh sẽ không thấy câu trả lời này']
        ],
        ...options.map((opt, idx) => [
          'div',
          { class: 'flex gap-2 py-2' },
          opt.isCorrect
            ? ['div', { class: 'flex text-green-600' }, ['span', { class: 'font-semibold' }, `${opt.id}.`], '✔']
            : ['div', { class: 'flex text-red-600' }, ['span', { class: 'font-semibold' }, `${opt.id}.`], '✘'],
          [
            'div',
            {},
            ['div', {}, opt.text || ''],
            opt.explanation
              ? [
                  'div',
                  {
                    class: `ml-4 text-sm italic ${opt.isCorrect ? 'text-green-600' : 'text-red-600'}`
                  },
                  (opt.isCorrect ? '💡 ' : '') + opt.explanation
                ]
              : ''
          ],
          idx < options.length - 1 ? ['hr', { class: 'my-2 h-[1px] border-gray-200' }] : ''
        ])
      ]
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer(QuizBlockComponent)
  }
})
