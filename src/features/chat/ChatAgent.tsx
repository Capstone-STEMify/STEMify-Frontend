'use client'
import { MessageCircle, X } from 'lucide-react'
import { motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { AiFillMessage, AiOutlineSend } from 'react-icons/ai'
import { FaSpinner } from 'react-icons/fa'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { useGetChatAiMutation } from '@/features/chat/api/chatAgentApi'
import { formatAgentResponse } from '@/utils/formatAgentResponse'

type Message = {
  user_message: string
  isUser: boolean
  // timestamp: Date
}

export default function ChatAgent() {
  //=====================================
  //      LOCAL STATE MANAGEMENT
  //=====================================
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  // const [isLoading, setIsLoading] = useState(false)
  const [postMessage, { isLoading: messageLoading }] = useGetChatAiMutation()

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  //=====================================
  //        RENDER
  //=====================================
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  //=====================================
  //          MESSAGE LOGIC
  //=====================================
  const handleSend = async () => {
    if (!input.trim()) return
    if (messageLoading) return
    const userMessage: Message = {
      user_message: input,
      isUser: true
      // timestamp: new Date()
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    await handleGenerateResponse(input)
  }

  async function handleGenerateResponse(userMessage: string) {
    try {
      setMessages((prev) => [...prev, { user_message: '...', isUser: false }])

      const response = await postMessage({ user_message: userMessage }).unwrap()
      setMessages((prev) => {
        const updatedMessages = [...prev]
        updatedMessages[updatedMessages.length - 1] = {
          user_message: response.response || 'Sorry, I cannot understand that',
          isUser: false
          // timestamp: new Date()
        }
        return updatedMessages
      })
    } catch (error) {
      setMessages((prev) => {
        const updatedMessages = [...prev]
        updatedMessages[updatedMessages.length - 1] = {
          user_message: 'Sorry, something went wrong. Please try again.',
          isUser: false
          // timestamp: new Date()
        }
        return updatedMessages
      })
    }
  }

  return (
    <div className='fixed right-6 bottom-6 z-50'>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.8 }}
        transition={{ duration: 0.3 }}
      >
        {isOpen && (
          <div className='flex h-[650px] w-[500px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl'>
            {/* Header */}
            <div className='flex items-center justify-between bg-gradient-to-r from-blue-500 to-sky-400 p-4 text-white'>
              <div className='flex items-center space-x-3'>
                <MessageCircle className='h-6 w-6' />
                <h1 className='text-lg font-bold'>STEMify Agent</h1>
              </div>
              <Button
                size='sm'
                onClick={() => setIsOpen(false)}
                className='rounded-full bg-red-500 p-1 transition-colors hover:bg-red-700'
              >
                <X className='h-5 w-5' />
              </Button>
            </div>

            {/* Messages */}
            <div className='flex-1 space-y-4 overflow-y-auto p-4'>
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isUser
                        ? 'bg-gradient-to-r from-blue-500 to-sky-400 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.user_message === '...' ? (
                      <div className='flex flex-row'>
                        <FaSpinner size={20} className='me-2 animate-spin' />
                        <div>Assistant is thinking...</div>
                      </div>
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: formatAgentResponse(message.user_message)
                        }}
                        className={`prose prose-sm max-w-none ${message.isUser ? 'text-white' : ''}`}
                      />
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className='flex gap-2 border-t p-4'>
              <div className='flex-1'>
                <Input
                  name='message'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='Type your message...'
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={messageLoading}
                />
              </div>
              <Button
                className='bg-gradient-to-r from-blue-500 to-sky-400'
                onClick={handleSend}
                // isLoading={messageLoading}
              >
                {messageLoading ? '' : <AiOutlineSend className='h-5 w-5' />}
              </Button>
            </div>
          </div>
        )}
      </motion.div>
      {!isOpen && (
        <div
          className='flex h-17 w-22 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-sky-400 text-white shadow-2xl'
          onClick={() => setIsOpen(true)}
        >
          <AiFillMessage size={35} />
        </div>
      )}
    </div>
  )
}
