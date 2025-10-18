'use client'

import { useState } from 'react'
import { Switch } from '@/components/shadcn/switch'
import { Label } from '@/components/shadcn/label'
import { Separator } from '@/components/shadcn/separator'
import { ChevronDown, Zap } from 'lucide-react'
import { Button } from '@/components/shadcn/button'

export default function QuizSettingsSidebar() {
  const [expandedSections, setExpandedSections] = useState({
    question: true,
    answer: true
  })

  const [settings, setSettings] = useState({
    shuffleQuestions: true,
    redemptionQuestion: false,
    improveTestScores: false,
    skipQuestions: false,
    adaptiveBank: false,
    passMark: false,
    attempt: false
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className='space-y-6'>
      {/* Question Section */}
      <div>
        <Button
          variant='ghost'
          className='mb-4 h-auto w-full justify-between p-0 hover:bg-transparent'
          onClick={() => toggleSection('question')}
        >
          <span className='text-foreground font-semibold'>Question</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expandedSections.question ? 'rotate-0' : '-rotate-90'}`}
          />
        </Button>

        {expandedSections.question && (
          <div className='space-y-4'>
            {/* Shuffle Questions */}
            <div className='hover:bg-muted/50 flex items-start justify-between gap-3 rounded-lg p-3 transition-colors'>
              <div className='flex-1'>
                <Label className='text-foreground cursor-pointer text-sm font-medium'>Shuffle questions</Label>
                <p className='text-muted-foreground mt-1 text-xs'>
                  Let the system randomly select a defined amount of questions from your question pool.
                </p>
              </div>
              <Switch checked={settings.shuffleQuestions} onCheckedChange={() => handleToggle('shuffleQuestions')} />
            </div>

            {/* Redemption Question */}
            <div className='hover:bg-muted/50 flex items-start justify-between gap-3 rounded-lg p-3 transition-colors'>
              <div className='flex-1'>
                <Label className='text-foreground cursor-pointer text-sm font-medium'>Redemption Question</Label>
                <p className='text-muted-foreground mt-1 text-xs'>
                  Allow learners to reattempt a few incorrect questions.
                </p>
              </div>
              <Switch
                checked={settings.redemptionQuestion}
                onCheckedChange={() => handleToggle('redemptionQuestion')}
              />
            </div>

            {/* Improve Test Scores */}
            <div className='hover:bg-muted/50 flex items-start justify-between gap-3 rounded-lg p-3 transition-colors'>
              <div className='flex-1'>
                <Label className='text-foreground flex cursor-pointer items-center gap-2 text-sm font-medium'>
                  Improve test scores
                  <span className='ml-1 flex items-center gap-1 rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800'>
                    <Zap className='h-3 w-3' />
                    NEW
                  </span>
                </Label>
                <p className='text-muted-foreground mt-1 text-xs'>
                  Try out these new features to prevent copying and raise learning.
                </p>
                <Button variant='link' className='mt-1 h-auto p-0 text-xs text-blue-600'>
                  See how it Works →
                </Button>
              </div>
              <Switch checked={settings.improveTestScores} onCheckedChange={() => handleToggle('improveTestScores')} />
            </div>

            {/* Skip Questions & Attempt Later */}
            <div className='hover:bg-muted/50 flex items-start justify-between gap-3 rounded-lg p-3 transition-colors'>
              <div className='flex-1'>
                <Label className='text-foreground cursor-pointer text-sm font-medium'>
                  Skip Questions & Attempt Later
                </Label>
                <p className='text-muted-foreground mt-1 text-xs'>
                  Allow students to skip questions and revisit them later during the qshadcnz.
                </p>
              </div>
              <Switch checked={settings.skipQuestions} onCheckedChange={() => handleToggle('skipQuestions')} />
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Answer Section */}
      <div>
        <Button
          variant='ghost'
          className='mb-4 h-auto w-full justify-between p-0 hover:bg-transparent'
          onClick={() => toggleSection('answer')}
        >
          <span className='text-foreground font-semibold'>Answer</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expandedSections.answer ? 'rotate-0' : '-rotate-90'}`}
          />
        </Button>

        {expandedSections.answer && (
          <div className='space-y-4'>
            {/* Pass Mark */}
            <div className='hover:bg-muted/50 flex items-start justify-between gap-3 rounded-lg p-3 transition-colors'>
              <div className='flex-1'>
                <Label className='text-foreground cursor-pointer text-sm font-medium'>Pass mark</Label>
                <p className='text-muted-foreground mt-1 text-xs'>
                  This will let you set minimum point to to learners to earn to pass the qshadcnz.
                </p>
              </div>
              <Switch checked={settings.passMark} onCheckedChange={() => handleToggle('passMark')} />
            </div>

            {/* Attempt */}
            <div className='hover:bg-muted/50 flex items-start justify-between gap-3 rounded-lg p-3 transition-colors'>
              <div className='flex-1'>
                <Label className='text-foreground cursor-pointer text-sm font-medium'>Attempt</Label>
                <p className='text-muted-foreground mt-1 text-xs'>
                  Let the system randomly select a defined amount of questions every time to prevent copying and raise
                  learning.
                </p>
              </div>
              <Switch checked={settings.attempt} onCheckedChange={() => handleToggle('attempt')} />
            </div>

            {/* Adaptive Question Bank Mode */}
            <div className='hover:bg-muted/50 flex items-start justify-between gap-3 rounded-lg p-3 transition-colors'>
              <div className='flex-1'>
                <Label className='text-foreground cursor-pointer text-sm font-medium'>
                  Adaptive question bank mode
                </Label>
                <p className='text-muted-foreground mt-1 text-xs'>
                  Generate a brief class of questions every time to prevent copying and raise learning.
                </p>
                <Button variant='link' className='mt-1 h-auto p-0 text-xs text-blue-600'>
                  Preview Templates →
                </Button>
              </div>
              <Switch checked={settings.adaptiveBank} onCheckedChange={() => handleToggle('adaptiveBank')} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
