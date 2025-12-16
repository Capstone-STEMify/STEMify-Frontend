'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Link as LinkIcon, 
  Check, 
  ChevronLeft, 
  Code2, 
  Share2, 
  Copy 
} from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { Separator } from '@/components/shadcn/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/shadcn/tooltip'

const BASE_APP_URL = process.env.NEXT_PUBLIC_BASE_APP_URL ?? '/'

export default function MicrobitReviewSubmission() {
  const params = useParams()
  const shareId = params?.shareId as string

  const [isCopied, setIsCopied] = useState(false)

  // URL cấu hình
  const editUrl = `${BASE_APP_URL}/#pub:${shareId}`
  const sandboxUrl = `${BASE_APP_URL}/#sandbox:${shareId}`
  const shareLink = `${BASE_APP_URL}/#pub:${shareId}`

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(shareLink)
      .then(() => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      })
      .catch(() => alert('Không thể copy link automatically.'))
  }

  const handleOpenEditor = () => {
    window.open(editUrl, '_blank')
  }

  if (!shareId) {
    return (
      <div className='flex h-screen items-center justify-center bg-slate-50'>
        <div className='flex flex-col items-center gap-4'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent'></div>
          <p className='text-sm font-medium text-slate-600'>Loading Project...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900'>
      {/* --- Header --- */}
      <header className='sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-6 py-3 backdrop-blur-md'>
        <div className='mx-auto flex max-w-7xl items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Link
              href='/'
              className='group flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900'
            >
              <ChevronLeft className='h-4 w-4 transition-transform group-hover:-translate-x-0.5' />
              Back
            </Link>
            <div className='hidden h-6 w-px bg-slate-200 sm:block'></div>
            <div className='flex items-center gap-2'>
              <span className='font-bold text-slate-800'>Stemify</span>
              <span className='rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600'>
                Micro:bit
              </span>
            </div>
          </div>
          
          <div className='flex items-center gap-3'>
             <Button 
                variant='outline' 
                size='sm' 
                onClick={handleOpenEditor}
                className='hidden sm:flex gap-2 border-slate-200 hover:bg-slate-50 hover:text-blue-600'
             >
                <Code2 className='h-4 w-4' />
                Open in Editor
             </Button>
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className='flex flex-1 flex-col items-center p-4 sm:p-6 lg:p-8'>
        <div className='w-full max-w-6xl space-y-6'>
          
          {/* Project Info Bar */}
          <div className='flex flex-col justify-between gap-4 rounded-xl bg-white p-5 shadow-sm border border-slate-100 sm:flex-row sm:items-center'>
            <div className='space-y-1'>
              <div className='flex items-center gap-2'>
                <h1 className='text-xl font-bold text-slate-900'>Shared Project</h1>
                <Badge variant='secondary' className='bg-green-100 text-green-700 hover:bg-green-200'>
                  Public
                </Badge>
              </div>
              <div className='flex items-center gap-2 text-sm text-slate-500'>
                <span className='font-mono'>ID: {shareId}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => navigator.clipboard.writeText(shareId)}
                        className='rounded p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600'
                      >
                        <Copy className='h-3 w-3' />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Copy ID</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <Button
                onClick={handleCopyLink}
                className={`min-w-[140px] gap-2 transition-all duration-300 ${
                  isCopied 
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-200' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200'
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className='h-4 w-4' /> Copied!
                  </>
                ) : (
                  <>
                    <Share2 className='h-4 w-4' /> Share Link
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Editor/Sandbox Preview */}
          <Card className='overflow-hidden border-0 shadow-lg ring-1 ring-slate-900/5 sm:rounded-2xl'>
            <div className='relative aspect-[16/9] w-full bg-slate-900 sm:aspect-[16/10] md:aspect-[21/9] lg:h-[70vh] lg:aspect-auto'>
              <iframe
                id='embed-frame'
                src={sandboxUrl}
                title={`Microbit Sandbox ${shareId}`}
                sandbox='allow-scripts allow-same-origin allow-forms allow-popups'
                className='absolute inset-0 h-full w-full border-0'
              />
            </div>
            
            <Separator className='bg-slate-100' />
            
            <CardContent className='flex items-center justify-between bg-white px-6 py-3'>
               <div className='flex items-center gap-2 text-xs text-slate-400'>
                  <div className='h-2 w-2 rounded-full bg-green-500'></div>
                  <span>Sandbox Environment Active</span>
               </div>
               <p className='text-xs font-medium text-slate-400'>
                  Powered by <span className='text-slate-600'>Stemify</span>
               </p>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}