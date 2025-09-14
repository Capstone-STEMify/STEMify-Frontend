import { useState } from 'react'

interface ExportDialogProps {
  onClose: () => void
  onExport: (metadata: { title: string; description: string; author: string }) => void
}

export function ExportDialog({ onClose, onExport }: ExportDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [author, setAuthor] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && description.trim() && author.trim()) {
      onExport({ title: title.trim(), description: description.trim(), author: author.trim() })
    }
  }

  return (
    <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black'>
      <div className='mx-4 w-full max-w-md rounded-lg bg-white shadow-xl'>
        <div className='p-6'>
          <h2 className='mb-4 text-lg font-semibold text-gray-900'>Export Assembly</h2>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>Title</label>
              <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                placeholder='My Custom Assembly'
                required
              />
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                placeholder='A custom 3D assembly created for educational purposes...'
                required
              />
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>Author</label>
              <input
                type='text'
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                placeholder='Teacher Name'
                required
              />
            </div>

            <div className='flex gap-3 pt-4'>
              <button
                type='button'
                onClick={onClose}
                className='flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='flex-1 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'
              >
                Export
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
