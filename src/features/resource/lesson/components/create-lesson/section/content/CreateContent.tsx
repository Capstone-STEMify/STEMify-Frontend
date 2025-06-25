import React, { useState } from 'react'

interface ActiveTools {
  [key: string]: boolean
}

interface ToolbarButton {
  name: string
  label: string
  style: string
}

interface InsertTexts {
  [key: string]: string
}

type InsertContentType = 'list' | 'link' | 'image' | 'video'

export default function ContentComponent() {
  const [content, setContent] = useState('')
  const [activeTools, setActiveTools] = useState<ActiveTools>({})

  const toggleTool = (tool: string) => {
    setActiveTools((prev: ActiveTools) => ({ ...prev, [tool]: !prev[tool] }))
  }

  const toolbarButtons = [
    { name: 'bold', label: 'B', style: 'font-bold' },
    { name: 'italic', label: 'I', style: 'italic' },
    { name: 'underline', label: 'U', style: 'underline' },
    { name: 'strike', label: 'S', style: 'line-through' }
  ]

  const insertContent = (type: InsertContentType) => {
    const insertTexts: InsertTexts = {
      list: '\n• List item 1\n• List item 2\n• List item 3\n',
      link: '[Link text](https://example.com)',
      image: '![Image description](image-url.jpg)',
      video: '[Video: Video Title](video-url.mp4)'
    }

    setContent((prev: string) => prev + (insertTexts[type] || ''))
  }

  return (
    <div className='space-y-6'>
      <div>
        <label className='mb-2 block text-sm font-medium text-gray-700'>Lesson Content</label>

        <div className='overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm'>
          {/* Toolbar */}
          <div className='border-b border-gray-200 bg-gray-50 p-3'>
            <div className='flex flex-wrap gap-2'>
              {/* Text Formatting */}
              <div className='flex rounded border border-gray-300'>
                {toolbarButtons.map((tool) => (
                  <button
                    key={tool.name}
                    onClick={() => toggleTool(tool.name)}
                    className={`border-r border-gray-300 px-3 py-1 text-sm font-medium transition-colors last:border-r-0 hover:bg-gray-100 ${
                      activeTools[tool.name] ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                    } ${tool.style}`}
                  >
                    {tool.label}
                  </button>
                ))}
              </div>

              {/* Style Selectors */}
              <select className='rounded border border-gray-300 bg-white px-3 py-1 text-sm'>
                <option>Paragraph</option>
                <option>Heading 1</option>
                <option>Heading 2</option>
                <option>Heading 3</option>
                <option>Quote</option>
                <option>Code</option>
              </select>

              <select className='rounded border border-gray-300 bg-white px-3 py-1 text-sm'>
                <option>Arial</option>
                <option>Georgia</option>
                <option>Times New Roman</option>
                <option>Helvetica</option>
                <option>Courier New</option>
              </select>

              <select className='rounded border border-gray-300 bg-white px-3 py-1 text-sm'>
                <option>14px</option>
                <option>12px</option>
                <option>16px</option>
                <option>18px</option>
                <option>20px</option>
              </select>

              {/* Insert Tools */}
              <div className='flex rounded border border-gray-300'>
                <button
                  onClick={() => insertContent('list')}
                  className='border-r border-gray-300 px-3 py-1 text-sm hover:bg-gray-100'
                  title='Insert List'
                >
                  📝
                </button>
                <button
                  onClick={() => insertContent('link')}
                  className='border-r border-gray-300 px-3 py-1 text-sm hover:bg-gray-100'
                  title='Insert Link'
                >
                  🔗
                </button>
                <button
                  onClick={() => insertContent('image')}
                  className='border-r border-gray-300 px-3 py-1 text-sm hover:bg-gray-100'
                  title='Insert Image'
                >
                  📷
                </button>
                <button
                  onClick={() => insertContent('video')}
                  className='px-3 py-1 text-sm hover:bg-gray-100'
                  title='Insert Video'
                >
                  📹
                </button>
              </div>

              {/* Alignment */}
              <div className='flex rounded border border-gray-300'>
                <button className='border-r border-gray-300 px-3 py-1 text-sm hover:bg-gray-100'>⬅️</button>
                <button className='border-r border-gray-300 px-3 py-1 text-sm hover:bg-gray-100'>⬆️</button>
                <button className='px-3 py-1 text-sm hover:bg-gray-100'>➡️</button>
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className='p-4'>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder='Start writing your lesson content here...

You can:
• Add headings, paragraphs, and formatted text
• Insert images and videos to make lessons engaging
• Create lists and organize content structure
• Add links to external resources
• Use the toolbar above to format your content

Write in a clear, engaging way that helps students learn effectively!'
              className='min-h-[400px] w-full resize-none leading-relaxed text-gray-800 outline-none'
              style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px' }}
            />
          </div>

          {/* Status Bar */}
          <div className='flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-500'>
            <div className='flex gap-4'>
              <span>{content.length} characters</span>
              <span>{content.split(/\s+/).filter((word) => word.length > 0).length} words</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='h-2 w-2 rounded-full bg-green-500'></div>
              <span>Auto-saved just now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Content Settings */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Lesson Duration (minutes)</label>
          <input
            type='number'
            min='1'
            max='180'
            placeholder='15'
            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Difficulty Level</label>
          <select className='w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex justify-end gap-3'>
        <button className='rounded-md border border-gray-300 px-6 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50'>
          Save as Draft
        </button>
        <button className='rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700'>
          Publish Lesson
        </button>
      </div>
    </div>
  )
}
