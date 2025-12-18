'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { 
  Play, ThumbsUp, ThumbsDown, PlusCircle, Info, ChevronLeft, Menu, X, Loader2, Trash2 
} from 'lucide-react'

import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Switch } from '@/components/shadcn/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { supabase } from '@/libs/supabase/client'
import { toast } from 'sonner'
import { useAnalyzeProjectMutation } from '@/features/microbit/api/aiApi'
import { MicrobitEvaluateResponse } from '@/features/microbit/type/ai.type'

const BASE_APP_URL = process.env.NEXT_PUBLIC_BASE_APP_URL ?? '/'

interface Criteria {
  id: string;
  question: string;
  result: MicrobitEvaluateResponse | null;
  isAnalyzing: boolean;
}

export default function MicrobitReviewSubmission() {
  const params = useParams()
  const locale = useLocale()
  const t = useTranslations('microbit.review')
  const shareId = params?.shareId as string
  
  const scrollViewportRef = useRef<HTMLDivElement>(null)

  const [checklistName, setChecklistName] = useState(t('checklistName'))
  const [analysisType, setAnalysisType] = useState<'comprehensive' | 'specific_question'>('comprehensive')
  
  const [comprehensiveResult, setComprehensiveResult] = useState<MicrobitEvaluateResponse | null>(null)
  const [isComprehensiveAnalyzing, setIsComprehensiveAnalyzing] = useState(false)

  const [criterias, setCriterias] = useState<Criteria[]>([
    { id: '1', question: t('defaultQuestions.explain'), result: null, isAnalyzing: false },
    { id: '2', question: t('defaultQuestions.errors'), result: null, isAnalyzing: false },
    { id: '3', question: t('defaultQuestions.improvements'), result: null, isAnalyzing: false }
  ])
  
  const [evaluateOnLoad, setEvaluateOnLoad] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [analyzeProject] = useAnalyzeProjectMutation()

  const safeShareId = shareId || 'unknown'
  const sandboxUrl = `${BASE_APP_URL}/#sandbox:${safeShareId}`

  useEffect(() => {
    if (scrollViewportRef.current) {
      const scrollContainer = scrollViewportRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [criterias, comprehensiveResult]);

  const addCriteria = () => {
    setCriterias([...criterias, { 
      id: Math.random().toString(), 
      question: '', 
      result: null, 
      isAnalyzing: false 
    }])
  }

  const removeCriteria = (id: string) => {
    setCriterias(criterias.filter(c => c.id !== id))
  }

  const updateCriteriaState = (id: string, updates: Partial<Criteria>) => {
    setCriterias(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
  }

  const handleMainEvaluate = async () => {
    if (!shareId) return
    setIsComprehensiveAnalyzing(true)

    try {
      const { data, error } = await supabase.from('microbit_shares').select('text').eq('shareId', shareId).single()
      if (error) throw new Error('DB Error')
      const projectFiles = typeof data.text === 'string' ? JSON.parse(data.text) : data.text

      const response = await analyzeProject({
        project_files: projectFiles,
        question: null,
        language: locale,
        analysis_type: 'comprehensive'
      }).unwrap()

      if (response) {
        setComprehensiveResult(response)
        toast.success(t('successToast'))
      }
    } catch (err) {
      toast.error(t('errorToast'))
    } finally {
      setIsComprehensiveAnalyzing(false)
    }
  }

  const handleSpecificEvaluate = async (criteriaId: string, question: string) => {
    if (!shareId || !question.trim()) return
    updateCriteriaState(criteriaId, { isAnalyzing: true })

    try {
      const { data, error } = await supabase.from('microbit_shares').select('text').eq('shareId', shareId).single()
      if (error) throw new Error('DB Error')
      const projectFiles = typeof data.text === 'string' ? JSON.parse(data.text) : data.text

      const response = await analyzeProject({
        project_files: projectFiles,
        question: question,
        language: locale,
        analysis_type: 'specific_question'
      }).unwrap()

      if (response) {
        updateCriteriaState(criteriaId, { result: response })
        toast.success(t('successToast'))
      }
    } catch (err) {
      toast.error(t('errorToast'))
    } finally {
      updateCriteriaState(criteriaId, { isAnalyzing: false })
    }
  }

  return (
    <div className='relative flex h-[calc(100vh-88px)] w-full bg-white font-sans text-slate-900 mt-[88px]'>
      {isMobileSidebarOpen && (
        <div className='fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden' onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-[85vw] transform border-r border-slate-200 bg-white transition-transform duration-300 md:relative md:flex md:w-[500px] md:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className='flex h-full w-full flex-col'>
          
          <div className='flex items-center justify-between border-b p-3 shrink-0 bg-white z-10'>
            <Link href='/'><Button variant='ghost' size='sm' className='text-slate-600'><ChevronLeft className='h-4 w-4 mr-1' /> {t('back')}</Button></Link>
            <div className='font-medium text-slate-500 text-xs uppercase tracking-widest'>{t('checklist')}</div>
            <Button variant='ghost' size='icon' onClick={() => setIsMobileSidebarOpen(false)} className='md:hidden'><X /></Button>
          </div>

          <ScrollArea ref={scrollViewportRef} className='flex-1 h-full w-full'>
            <div className='flex flex-col gap-6 p-4 pb-12'>
              
              <div className='flex flex-col gap-3'>
                <div className='text-sm font-medium text-slate-700'>{t('analysisMode')}</div>
                <div className='flex items-center gap-2 shrink-0'>
                  <Input value={checklistName} onChange={(e) => setChecklistName(e.target.value)} className='text-base font-medium h-10 shadow-none border-slate-200 focus-visible:ring-blue-500' />
                  <Select value={analysisType} onValueChange={(value) => setAnalysisType(value as 'comprehensive' | 'specific_question')}>
                    <SelectTrigger className='w-[200px] h-10 border-slate-200 bg-blue-50 hover:bg-blue-100 transition-colors'>
                      <div className='flex items-center gap-2'>
                        {analysisType === 'comprehensive' ? <Info className='h-4 w-4 text-blue-600' /> : <Play className='h-4 w-4 text-green-600' />}
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='comprehensive' className='cursor-pointer'>
                        <div className='flex items-center gap-2'>
                          {t('comprehensiveTab')}
                        </div>
                      </SelectItem>
                      <SelectItem value='specific_question' className='cursor-pointer'>
                        <div className='flex items-center gap-2'>
                          {t('specificTab')}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {analysisType === 'comprehensive' && (
                  <Button 
                    onClick={handleMainEvaluate} 
                    disabled={isComprehensiveAnalyzing}
                    className='bg-blue-600 hover:bg-blue-700 text-white h-10 px-3'
                  >
                    {isComprehensiveAnalyzing ? <Loader2 className='h-4 w-4 animate-spin' /> : <>{t('evaluate')} <Play className='ml-2 h-3 w-3 fill-current' /></>}
                  </Button>
                  )}
                </div>
              </div>

              {analysisType === 'comprehensive' && comprehensiveResult && (
                <div className='space-y-4 rounded-xl border border-blue-100 bg-blue-50/30 p-5 shadow-sm animate-in fade-in duration-300'>
                  <div className='flex items-start gap-2 text-[13px] text-blue-600'>
                    <Info className='mt-0.5 h-3.5 w-3.5 shrink-0' />
                    <span className='font-semibold'>{t('comprehensiveTab')}</span>
                  </div>
                  <div className='whitespace-pre-wrap leading-relaxed text-slate-700 text-[15px]'>
                    {comprehensiveResult.analysis}
                  </div>
                </div>
              )}

              {analysisType === 'specific_question' && (
                <div className='space-y-4'>
                  {criterias.map((criteria) => (
                    <div key={criteria.id} className='flex flex-col gap-4'>
                      <div className='flex items-center gap-3'>
                        <span className='text-sm font-bold text-slate-700 whitespace-nowrap'>{t('askAI')}</span>
                        <Input 
                          placeholder={t('placeholder')} 
                          value={criteria.question}
                          onChange={(e) => updateCriteriaState(criteria.id, { question: e.target.value })}
                          className='h-10 flex-1 border-slate-200 shadow-none' 
                        />
                        <Button variant='ghost' size='icon' onClick={() => removeCriteria(criteria.id)} className='text-slate-400 hover:text-red-500'>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                        <Button 
                          variant='outline' size='icon' 
                          onClick={() => handleSpecificEvaluate(criteria.id, criteria.question)}
                          disabled={criteria.isAnalyzing}
                          className='h-10 w-10 border-slate-200 shrink-0'
                        >
                          {criteria.isAnalyzing ? <Loader2 className='h-4 w-4 animate-spin' /> : <Play className='h-4 w-4 fill-slate-800' />}
                        </Button>
                      </div>

                      {criteria.result && (
                        <div className='space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm animate-in fade-in duration-300'>
                          <div className='flex items-start gap-2 text-[13px] text-slate-500'>
                            <Info className='mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500' />
                            <span>{t('experimental')}</span>
                          </div>
                          <div className='whitespace-pre-wrap leading-relaxed text-slate-700 text-[15px]'>
                            {criteria.result.analysis}
                          </div>
                          <div className='flex items-center justify-end gap-3 border-t border-slate-100 pt-3'>
                            <span className='text-xs font-medium text-slate-400'>{t('helpful')}</span>
                            <Button variant='ghost' size='icon' className='h-8 w-8 text-slate-400 hover:text-blue-600'><ThumbsUp className='h-4 w-4' /></Button>
                            <Button variant='ghost' size='icon' className='h-8 w-8 text-slate-400 hover:text-red-600'><ThumbsDown className='h-4 w-4' /></Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <Button 
                    variant='outline' 
                    onClick={addCriteria}
                    className='w-full py-4 border-dashed border-blue-200 bg-blue-50/20 text-blue-600 hover:bg-blue-50 transition-colors rounded-xl'
                  >
                    <PlusCircle className='mr-2 h-4 w-4' /> {t('addCriteria')}
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </aside>

      <main className='relative flex-1 bg-slate-100'>
        <header className='flex h-12 items-center justify-between border-b bg-white px-4 shrink-0'>
          <div className='flex items-center gap-2'>
            <Button variant='ghost' size='icon' className='md:hidden' onClick={() => setIsMobileSidebarOpen(true)}><Menu /></Button>
            <span className='font-bold text-blue-600 uppercase text-[10px] tracking-widest'>{t('localProject')}</span>
          </div>
          <div className='flex items-center gap-3'>
             <span className='text-[10px] font-bold text-blue-600 uppercase tracking-tight'>{t('evaluateOnLoad')}</span>
             <Switch checked={evaluateOnLoad} onCheckedChange={setEvaluateOnLoad} />
          </div>
        </header>
        <iframe src={sandboxUrl} className='h-full w-full border-0' />
      </main>
    </div>
  )
}