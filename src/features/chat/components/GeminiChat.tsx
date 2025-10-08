'use client'
import React, { useState } from 'react'

interface ChatMessage {
  role: 'user' | 'model'
  content: string
}

export default function GeminiChat() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error)

      const reply = data.reply as string
      setMessages((prev) => [...prev, { role: 'user', content: input }, { role: 'model', content: reply }])
      setInput('')
    } catch (error) {
      console.error(error)
      alert('Đã xảy ra lỗi khi gọi Gemini API.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='mx-auto max-w-lg p-4'>
      <div className='mb-3 h-80 overflow-y-auto rounded-md border p-3'>
        {messages.map((m, i) => (
          <p key={i} className={m.role === 'user' ? 'text-blue-600' : 'text-green-700'}>
            <b>{m.role === 'user' ? 'You:' : 'AI:'}</b> {m.content}
          </p>
        ))}
        {loading && <p className='text-gray-500 italic'>AI đang trả lời...</p>}
      </div>

      <div className='flex gap-2'>
        <input
          className='flex-1 rounded border p-2'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Nhập tin nhắn...'
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className='rounded bg-sky-600 px-4 text-white disabled:opacity-50'
        >
          Gửi
        </button>
      </div>
    </div>
  )
}
