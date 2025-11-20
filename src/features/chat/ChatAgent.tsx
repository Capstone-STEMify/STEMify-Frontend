'use client'
import { Loader2, MessageCircle, X } from 'lucide-react'
import { motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { AiFillMessage, AiOutlineSend } from 'react-icons/ai'
import { FaSpinner } from 'react-icons/fa'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { useGetCourseRecommendedAiMutation, useGetGeneralChatAiMutation } from '@/features/chat/api/agentApi'
import { formatAgentResponse } from '@/utils/formatAgentResponse'
import SSelect from '@/components/shared/SSelect'

type Message = {
  content: string
  isUser: boolean
  timestamp: Date
}

// INITIAL_MESSAGES viết bằng tiếng việt
const INITIAL_MESSAGES = {
  'course-recommendations':
    'Chào bạn! Tôi là trợ lý AI của STEMify. Tôi có thể giúp bạn tìm các khóa học phù hợp dựa trên sở thích và mục tiêu học tập của bạn. Hãy cho tôi biết bạn quan tâm đến lĩnh vực nào hoặc mục tiêu học tập cụ thể của bạn nhé!',
  'general-question':
    'Chào bạn! Tôi là trợ lý AI của STEMify. Tôi có thể giúp bạn với bất kỳ câu hỏi nào về nền tảng STEMify, các khóa học hoặc bất kỳ câu hỏi nào khác mà bạn có trong đầu.'
}

export default function ChatAgent() {
  //=====================================
  //      LOCAL STATE MANAGEMENT
  //=====================================
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<string>('general-question')
  const [postCourseMessage, { isLoading: messageCourseLoading }] = useGetCourseRecommendedAiMutation()
  const [postGeneralMessage, { isLoading: messageGeneralLoading }] = useGetGeneralChatAiMutation()

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const modeOptions = [
    { value: 'course-recommendations', label: 'Gợi ý khóa học' },
    { value: 'general-question', label: 'Câu hỏi về lĩnh vực STEM' }
  ]

  //=====================================
  //        RENDER
  //=====================================
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    setMessages([
      {
        content: INITIAL_MESSAGES[mode as keyof typeof INITIAL_MESSAGES],
        isUser: false,
        timestamp: new Date()
      }
    ])
  }, [mode])

  //=====================================
  //          MESSAGE LOGIC
  //=====================================
  const handleSend = async () => {
    if (!input.trim()) return
    const userMessage: Message = {
      content: input,
      isUser: true,
      timestamp: new Date()
    }
    setMessages((prev) => [...prev, userMessage])
    const loadingMessage: Message = {
      content: '...',
      isUser: false,
      timestamp: new Date()
    }
    setMessages((prev) => [...prev, loadingMessage])
    setInput('')
    await handleGenerateResponse(input)
  }

  async function handleGenerateResponse(userMessage: string) {
    let response: any

    switch (mode) {
      case 'course-recommendations':
        response = await postCourseMessage({ userPrompt: userMessage }).unwrap()
        break
      case 'general-question':
        response = await postGeneralMessage({ userPrompt: userMessage }).unwrap()
        break
    }

    setMessages((prev) => {
      const updatedMessages = [...prev]
      updatedMessages[updatedMessages.length - 1] = {
        content: response?.data?.message || 'Xin lỗi, tôi chưa hiểu ý bạn.',
        isUser: false,
        timestamp: new Date()
      }
      return updatedMessages
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
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
                <h1 className='text-lg font-bold'>Trợ lý STEMify</h1>
              </div>
              <Button
                size='sm'
                onClick={() => setIsOpen(false)}
                className='rounded-full bg-red-500 p-1 transition-colors hover:bg-red-700'
              >
                <X className='h-5 w-5' />
              </Button>
            </div>

            {/* Mode Selector */}
            <div className='border-b p-2'>
              <SSelect
                options={modeOptions}
                value={mode}
                onChange={(value) => setMode(value)}
                className='w-full'
                placeholder='Select Mode'
              />
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
                    {message.content === '...' ? (
                      <div className='flex flex-row'>
                        <FaSpinner size={20} className='me-2 animate-spin' />
                        <div>Stemify đang suy nghĩ...</div>
                      </div>
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: formatAgentResponse(message.content)
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
                  onKeyDown={handleKeyDown}
                  disabled={messageCourseLoading || messageGeneralLoading}
                />
              </div>
              <Button
                className='bg-gradient-to-r from-blue-500 to-sky-400'
                onClick={handleSend}
                disabled={messageCourseLoading || messageGeneralLoading}
              >
                {messageCourseLoading || messageGeneralLoading ? (
                  <Loader2 className='h-5 w-5 animate-spin' />
                ) : (
                  <AiOutlineSend className='h-5 w-5' />
                )}
              </Button>
            </div>
          </div>
        )}
      </motion.div>
      {!isOpen && (
        <button
          className='flex cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-sky-400 px-4 py-2 text-white shadow-2xl'
          onClick={() => setIsOpen(true)}
        >
          <AiFillMessage size={25} />
        </button>
      )}
    </div>
  )
}
