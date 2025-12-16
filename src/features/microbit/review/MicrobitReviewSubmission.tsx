'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Printer, 
  Download, 
  Play, 
  Trash2, 
  ThumbsUp, 
  ThumbsDown, 
  PlusCircle, 
  MoreHorizontal,
  Info,
  ChevronLeft,
  Menu,
  X
} from 'lucide-react'

import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import { Switch } from '@/components/shadcn/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { ScrollArea } from '@/components/shadcn/scroll-area'

const BASE_APP_URL = process.env.NEXT_PUBLIC_BASE_APP_URL ?? '/'

export default function MicrobitReviewSubmission() {
  const params = useParams()
  const shareId = params?.shareId as string

  const [checklistName, setChecklistName] = useState('New Checklist')
  const [evaluateOnLoad, setEvaluateOnLoad] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const safeShareId = shareId || 'unknown'
  const sandboxUrl = `${BASE_APP_URL}/#sandbox:${safeShareId}`

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
    <div className='flex h-screen w-full bg-white text-slate-900 font-sans overflow-hidden relative'>
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 
          transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
          /* Mobile Width */
          w-[85vw] sm:w-[450px]
          /* Desktop Width (Đã tăng lên) */
          md:relative md:translate-x-0 md:flex md:flex-col
          md:w-[500px] lg:w-[600px] xl:w-[650px] 
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div defaultValue='checklist' className='flex flex-col h-full'>
          <div className='flex items-center justify-between px-2 pt-2 border-b border-slate-100 bg-white shrink-0'>
            <div className='flex items-center justify-between bg-transparent p-0 h-10 gap-4'>
              <Link href="/" className='flex items-center'>
                 <Button variant="ghost" size="sm" className='text-slate-500 gap-1 pl-1'>
                    <ChevronLeft className='h-4 w-4' /> <span className="hidden sm:inline">Back</span>
                 </Button>
              </Link>
              <div 
                className='rounded-none px-2 text-slate-500 font-medium'
              >
                Checklist
              </div>
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden text-slate-400"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div  className='flex-1 flex flex-col p-0 m-0 overflow-hidden'>
            <ScrollArea className='h-full'>
              <div className='flex flex-col gap-6 p-4'>
                
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
                  <Input 
                    value={checklistName} 
                    onChange={(e) => setChecklistName(e.target.value)}
                    className='text-lg font-medium border-slate-200 focus-visible:ring-1 bg-transparent px-2 h-10 shadow-sm w-full'
                  />
                  <div className='flex items-center gap-1 w-full sm:w-auto justify-end'>
                    <Button variant='outline' size='icon' className='h-9 w-9 text-slate-600 border-slate-300'>
                      <Download className='h-4 w-4' />
                    </Button>
                    <Button variant='outline' size='icon' className='h-9 w-9 text-slate-600 border-slate-300'>
                      <Printer className='h-4 w-4' />
                    </Button>
                    <Button className='h-9 bg-blue-700 hover:bg-blue-800 text-white gap-1 px-3 shadow-sm'>
                      Evaluate <Play className='h-3 w-3 fill-current' />
                    </Button>
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2'>
                    <span className='text-sm font-medium whitespace-nowrap text-slate-700 hidden sm:inline'>Ask AI:</span>
                    <div className='flex-1 relative'>
                      <Input 
                        placeholder='Evaluate this code...' 
                        className='h-9 text-sm'
                      />
                    </div>
                    <div className="flex gap-2">
                        <Select defaultValue='na'>
                        <SelectTrigger className='w-[80px] h-9'>
                            <SelectValue placeholder='Score' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='na'>N/A</SelectItem>
                            <SelectItem value='pass'>Pass</SelectItem>
                            <SelectItem value='fail'>Fail</SelectItem>
                        </SelectContent>
                        </Select>
                        <div className='flex sm:hidden gap-1'>
                            <Button variant='outline' size='icon' className='h-9 w-9'><Play className='h-4 w-4'/></Button>
                        </div>
                    </div>
                  </div>
                  
                  <div className='hidden sm:flex justify-end gap-2'>
                     <Button variant='ghost' size='icon' className='h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50'>
                        <Trash2 className='h-4 w-4' />
                     </Button>
                     <Button variant='outline' size='icon' className='h-8 w-8 border-slate-300'>
                        <Play className='h-4 w-4 fill-slate-800' />
                     </Button>
                  </div>
                </div>

                {/* 3. Feedback */}
                <div className='border border-slate-200 rounded-lg p-3 bg-slate-50 text-sm space-y-3'>
                  <div className='flex items-start gap-2 text-xs text-slate-500 mb-1 leading-tight'>
                    <Info className='h-3 w-3 mt-0.5 shrink-0' />
                    <span>Experimental: AI outputs may not be accurate.</span>
                  </div>
                  <div className='space-y-3 pt-1'>
                    <p className='text-slate-700 leading-relaxed'>
                        The code plays a melody at 120 beats per minute when the micro:bit starts, but does nothing when button A is pressed or continuously in the forever loop.
                    </p>
                    <p className='text-slate-700 leading-relaxed'>
                        The &quot;on start&quot; block is used to play a melody with pauses, indicated by the dashes, at a speed of 120 beats per minute. The &quot;on button A pressed&quot; block is empty, meaning no action is taken.
                    </p>
                  </div>
                  <div className='flex items-center justify-end gap-2 pt-2 border-t border-slate-200/50'>
                    <span className='text-xs text-slate-400'>Helpful?</span>
                    <button className='hover:bg-slate-200 p-1 rounded'><ThumbsUp className='h-4 w-4 text-slate-500' /></button>
                    <button className='hover:bg-slate-200 p-1 rounded'><ThumbsDown className='h-4 w-4 text-slate-500' /></button>
                  </div>
                </div>

                {/* 4. Add Criteria */}
                <div>
                  <Button variant='outline' className='w-full justify-center gap-2 h-10 text-blue-600 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50'>
                    <PlusCircle className='h-4 w-4' /> Add Criteria
                  </Button>
                </div>

              </div>
            </ScrollArea>
          </div>
        </div>
      </aside>

      <main className='flex-1 flex flex-col bg-[#f0f2f5] overflow-hidden relative w-full'>
        
        <header className='h-12 bg-white border-b border-slate-200 flex items-center justify-between px-3 md:px-4 shrink-0 shadow-sm z-20'>
          <div className='flex items-center gap-2 md:gap-3 overflow-hidden'>
            <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden -ml-2 text-slate-600"
                onClick={() => setIsMobileSidebarOpen(true)}
            >
                <Menu className="h-5 w-5" />
            </Button>

            <span className='font-semibold text-blue-600 truncate'>local project</span>
          </div>
          
          <div className='flex items-center gap-2 md:gap-3'>
            <div className="flex items-center gap-2">
                <span className='hidden sm:inline text-[11px] font-bold text-blue-600 uppercase tracking-wider'>Evaluate on load</span>
                <span className='sm:hidden text-[11px] font-bold text-blue-600 uppercase'>Auto-eval</span>
                <Switch 
                checked={evaluateOnLoad}
                onCheckedChange={setEvaluateOnLoad}
                className='data-[state=checked]:bg-blue-600 scale-75 md:scale-90'
                />
            </div>
            <div className='w-px h-4 bg-slate-300 mx-1 hidden sm:block'></div>
            <Button variant='ghost' size='icon' className='h-8 w-8 text-slate-400 hidden sm:flex'>
               <MoreHorizontal className='h-5 w-5' />
            </Button>
          </div>
        </header>

        <div className='flex-1 relative bg-slate-100'>
            <iframe
              id='embed-frame'
              src={sandboxUrl}
              title={`Microbit Sandbox ${shareId}`}
              className='absolute inset-0 w-full h-full border-0'
              sandbox='allow-scripts allow-same-origin allow-forms allow-popups'
            />
        </div>

        <div className='absolute bottom-4 right-4 md:bottom-5 md:right-5 z-30'>
          <Button size='icon' className='rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg h-10 w-10 md:h-12 md:w-12 transition-transform hover:scale-105'>
            <PlusCircle className='h-5 w-5 md:h-6 md:w-6 text-white' />
          </Button>
        </div>

      </main>
    </div>
  )
}