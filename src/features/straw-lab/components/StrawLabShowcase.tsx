'use client'

import React, { useState } from 'react'
import { Bot, ChevronUp, Cpu, FolderKanban } from 'lucide-react'
import { FaVectorSquare } from 'react-icons/fa'
import STabs from '@/components/shared/STabs'
import StrawLabList from '@/features/straw-lab/components/StrawLabList'
import StrawLabProject from '@/features/straw-lab/components/StrawLabProject'
import dynamic from 'next/dynamic'
import MicroAI from '@/features/blockly-self-build/components/MicroAI'
import TeachableMachinePage from '@/features/AI-model/components/TeachableMachinePage'

const MakeCodeEditor = dynamic(() => import('@/components/microbit/MakeCodeEmbed'), { ssr: false })

export default function StrawLabShowcase() {
  return (
    <div className=''>
      <div className='mx-auto px-4 py-6 md:py-10'>
        <STabs
          defaultValue='straw-lab'
          items={[
            {
              label: (
                <div className='flex items-center gap-2'>
                  <FaVectorSquare className='h-5 w-5' />
                  <span className='font-semibold'>Straw Assembly</span>
                </div>
              ),
              value: 'straw-lab',
              content: <StrawLabList />
            },
            {
              label: (
                <div className='flex items-center gap-2'>
                  <div className='flex items-center gap-2'>
                    <Cpu className='h-6 w-6' />
                    <span className='font-semibold'>Micro:bit</span>
                  </div>
                  <ChevronUp className='mt-1 hidden h-4 w-4 text-zinc-900 group-hover:block' />
                </div>
              ),
              value: 'micro-bit',
              content: (
                <div>
                  <MakeCodeEditor />
                </div>
              )
            },
            {
              label: (
                <div className='flex items-center gap-2'>
                  <Bot className='h-6 w-6' />
                  <span className='font-medium'>ModelMaker</span>
                </div>
              ),
              value: 'microbit-ai',
              content: (
                <div>
                  <TeachableMachinePage />
                </div>
              )
            },
            {
              label: (
                <div className='flex items-center gap-2'>
                  <FolderKanban className='h-6 w-6' />
                  <span className='font-medium'>My Project</span>
                </div>
              ),
              value: 'my-project',
              content: (
                <div>
                  <StrawLabProject />
                </div>
              )
            }
          ]}
        />
      </div>
    </div>
  )
}
