'use client'

import * as React from 'react'
import { Download, CheckCircle2, Circle, Clock, Bot, AlertTriangle, Sparkles, BrainCircuit } from 'lucide-react'

import { Button } from '@/components/shadcn/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/shadcn/accordion'

import { 
  useAnalyzeClassroomProgressMutation,
  useGetClassroomByIdQuery, 
  useGetClassroomStudentProgressQuery,
} from '@/features/classroom/api/classroomApi'
import { StudentProgressItem, AiStudentAnalysisResult } from '@/features/classroom/types/classroom.type'
import { useTranslations } from 'next-intl'
import Loading from 'app/[locale]/loading'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/shadcn/tooltip'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import { toast } from 'sonner' // Thêm toast để báo lỗi nếu cần

interface CourseType {
  id: number
  title: string
}

interface StudentProgressStatisticProps {
  classroomId: number
  courses: CourseType[]
}

const COLUMN_WIDTH = 'w-[70px] min-w-[70px]'

export function StudentProgressStatistic({ classroomId, courses }: StudentProgressStatisticProps) {
  const t = useTranslations('dashboard.classroom')
  
  // --- STATES ---
  const [selectedCourseId, setSelectedCourseId] = React.useState<string>('')
  const [currentLessonId, setCurrentLessonId] = React.useState<string>('')
  
  // AI States
  const [aiData, setAiData] = React.useState<{
    overviewText: string;
    students: AiStudentAnalysisResult[];
    atRiskCount: number;
  } | null>(null)
  
  const [filterAtRisk, setFilterAtRisk] = React.useState(false)
  const [selectedAnalysisStudent, setSelectedAnalysisStudent] = React.useState<AiStudentAnalysisResult | null>(null)

  // --- QUERIES ---
  const { data: classroomRes } = useGetClassroomByIdQuery(classroomId, {
    skip: !classroomId
  })
  const curriculum = classroomRes?.data?.course

  const [analyzeTrigger, { isLoading: isAnalyzing }] = useAnalyzeClassroomProgressMutation()

  React.useEffect(() => {
    if (courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(String(courses[0].id))
    }
  }, [courses, selectedCourseId])

  const { data: progressRes, isFetching } = useGetClassroomStudentProgressQuery(
    { classroomId, courseId: Number(selectedCourseId) },
    { skip: !classroomId || !selectedCourseId }
  )

  const progressData = progressRes?.data
  const lessons = progressData?.lessons || []
  const students = progressData?.StudentProgress || []

  React.useEffect(() => {
    if (lessons.length > 0) {
      const exists = lessons.find((l) => String(l.lessonId) === currentLessonId)
      if (!currentLessonId || !exists) {
        setCurrentLessonId(String(lessons[0].lessonId))
      }
    }
  }, [lessons, currentLessonId])

  const currentLesson = lessons.find((l) => String(l.lessonId) === currentLessonId)

  // --- REAL API CALL (UPDATED) ---
  const handleAnalyzeClassroom = async () => {
    try {
      const response = await analyzeTrigger({
        classroom_id: classroomId,
        force_mock: false, 
        analysis_period_days: 7
      }).unwrap()

      console.log("AI Raw Response:", response) // Debug log

      const payload = response.data || response;

      if (!payload || !payload.students) {
        toast.error("Invalid AI response structure");
        return;
      }

      let mappedStudents = payload.students;
      
      const isIdMismatch = students.length > 0 && payload.students.length > 0 && 
                           !students.some(s => s.studentId === payload.students[0].studentId);

      if (isIdMismatch) {
        console.warn("Detected ID mismatch (Mock Data). Auto-mapping by index for UI demo.");
        mappedStudents = payload.students.map((aiStudent: any, index: number) => {
          const realStudent = students[index];
          return {
            ...aiStudent,
            studentId: realStudent ? realStudent.studentId : aiStudent.studentId
          };
        });
      }

      const atRiskStudents = mappedStudents.filter((s: any) => s.currentStatus === 'AtRisk')
      
      setAiData({
        overviewText: payload.overviewText || payload.aiInsightsText,
        students: atRiskStudents, 
        atRiskCount: atRiskStudents.length
      })

      if (atRiskStudents.length > 0) {
        toast.success(`AI found ${atRiskStudents.length} students at risk.`)
      } else {
        toast.info("AI analysis complete. No students currently at risk.")
      }

    } catch (error) {
      console.error("AI Analysis Failed:", error)
      toast.error("Failed to analyze progress. Please try again later.")
    }
  }

  // --- HELPERS ---
  const renderSectionStatus = (student: StudentProgressItem, lessonId: number, sectionId: number) => {
    const lessonProg = student.lessonProgresses?.find((l) => l.lessonId === lessonId)
    if (!lessonProg) return <Circle className='mx-auto h-4 w-4 text-slate-200' />

    const sectionProg = lessonProg.sectionProgresses?.find((s) => s.sectionId === sectionId)
    if (!sectionProg) return <Circle className='mx-auto h-4 w-4 text-slate-200' />

    switch (sectionProg.status) {
      case 'Completed':
      case 'Passed':
        return <CheckCircle2 className='mx-auto h-4 w-4 text-green-500' />
      case 'InProgress':
        return <Clock className='mx-auto h-4 w-4 text-blue-500' />
      case 'Failed':
        return <Circle className='mx-auto h-4 w-4 border-red-400 text-red-400' />
      default:
        return <Circle className='mx-auto h-4 w-4 text-slate-300' />
    }
  }

  const displayedStudents = React.useMemo(() => {
    if (!filterAtRisk || !aiData) return students
    
    const atRiskIds = aiData.students.map(s => s.studentId)
    
    return students.filter(s => atRiskIds.includes(s.studentId))
  }, [students, filterAtRisk, aiData])

  return (
    <div className='mt-8 rounded-xl border bg-white p-4 shadow-sm md:p-8'>
      <header className='mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div className='flex items-center gap-4'>
          <h2 className='text-2xl font-semibold'>{t('overview.progress.title')}</h2>
          
          {/* AI TRIGGER BUTTON */}
          <Button 
            onClick={handleAnalyzeClassroom} 
            disabled={isAnalyzing}
            className={`gap-2 transition-all ${aiData ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90'}`}
            variant={aiData ? "outline" : "default"}
          >
             {isAnalyzing ? (
               <>
                <Clock className="h-4 w-4 animate-spin" /> Analyzing...
               </>
             ) : (
               <>
                <Sparkles className="h-4 w-4" /> {aiData ? 'Re-Analyze AI' : 'Ask AI Insights'}
               </>
             )}
          </Button>

        </div>
        
        {/* FILTERS */}
        <div className='flex items-center gap-2'>
            <div className='flex items-center gap-2 text-sm'>
              <Select value={curriculum?.code || ''} disabled>
                <SelectTrigger className='w-[150px]'>
                  <SelectValue placeholder={curriculum?.title || 'Curriculum'} />
                </SelectTrigger>
                <SelectContent>
                  {curriculum && <SelectItem value={curriculum.code}>{curriculum.title}</SelectItem>}
                </SelectContent>
              </Select>

              <Select value={selectedCourseId} onValueChange={setSelectedCourseId} disabled={courses.length === 0}>
                <SelectTrigger className='w-[150px]'>
                  <SelectValue placeholder='Select course' />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={String(course.id)}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          <Button variant='outline' size='icon'>
            <Download className='h-4 w-4' />
          </Button>
        </div>
      </header>

      {/* --- AI RESULT SECTION --- */}
      {aiData && (
        <Card className="mb-6 bg-slate-50/50 border-purple-100 animate-in fade-in slide-in-from-top-4 duration-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg text-purple-900">
              <Bot className="h-5 w-5 text-purple-600" />
              AI Classroom Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <p className="text-sm text-slate-700 leading-relaxed italic border-l-4 border-purple-300 pl-3">
                  "{aiData.overviewText}"
                </p>
              </div>
              <div className="flex flex-col gap-2 min-w-[200px]">
                <Button 
                  variant={filterAtRisk ? "destructive" : "outline"}
                  className={`justify-between group border-red-200 ${!filterAtRisk && 'text-red-600 hover:bg-red-50'}`}
                  onClick={() => setFilterAtRisk(!filterAtRisk)}
                >
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Students at risk
                  </span>
                  <Badge variant={filterAtRisk ? "outline" : "destructive"} className="ml-2">
                    {aiData.atRiskCount}
                  </Badge>
                </Button>
                {filterAtRisk && (
                   <p className="text-xs text-center text-slate-500 animate-pulse">
                     Filtering table below...
                   </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- TABLE CONTENT --- */}
      {isFetching && !currentLesson ? (
        <Loading />
      ) : !currentLesson ? (
        <div className='rounded-lg border py-10 text-center text-slate-500'>{t('overview.progress.noLesson')}</div>
      ) : (
        <div className='overflow-hidden rounded-lg border bg-white'>
          <div className='overflow-x-auto'>
            <Table className='min-w-[900px]'>
              <TableHeader>
                <TableRow>
                  <TableHead
                    rowSpan={2}
                    className='bg-background sticky left-0 z-20 w-[250px] min-w-[250px] border-r align-top shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]'
                  >
                    <div className='flex flex-col gap-2 px-2 py-4'>
                      <label className='text-sm font-medium'>{t('overview.progress.sort')}</label>
                      <Select defaultValue='display-name'>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Sort by' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='display-name'>{t('overview.progress.disName')}</SelectItem>
                          <SelectItem value='first-name'>{t('overview.progress.firstName')}</SelectItem>
                          <SelectItem value='last-name'>{t('overview.progress.lastName')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableHead>

                  <TableHead
                    colSpan={Math.max(currentLesson.sectionIds.length, 1)}
                    className='h-[88px] bg-gradient-to-r from-blue-500 to-indigo-600 align-middle text-white hover:from-blue-600 hover:to-indigo-700'
                  >
                    <div className='flex h-full w-full items-center px-2'>
                      <Select value={currentLessonId} onValueChange={setCurrentLessonId}>
                        <SelectTrigger className='h-full w-full cursor-pointer justify-start gap-2 rounded-none border-none bg-transparent pl-4 text-lg font-semibold text-white shadow-none hover:text-white'>
                          <SelectValue placeholder='Select a lesson' />
                        </SelectTrigger>
                        <SelectContent>
                          {lessons.map((lesson) => (
                            <SelectItem key={lesson.lessonId} value={String(lesson.lessonId)}>
                              {lesson.lessonTitle}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableHead>
                </TableRow>

                <TableRow>
                  {currentLesson.sectionIds.map((sectionId) => (
                    <TableHead
                      key={sectionId}
                      className={`border-r bg-slate-50 p-2 text-center text-xs font-normal text-slate-600 ${COLUMN_WIDTH}`}
                    >
                      Sec {sectionId}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {displayedStudents.length > 0 ? (
                  displayedStudents.map((student) => {
                    const atRiskInfo = aiData?.students.find(s => s.studentId === student.studentId);

                    return (
                      <TableRow 
                        key={student.studentId} 
                        className={`group hover:bg-slate-50/50 ${atRiskInfo ? 'bg-red-50/30' : ''}`}
                      >
                        <TableCell className={`bg-background sticky left-0 z-10 border-r group-hover:bg-slate-50 ${atRiskInfo ? 'bg-red-50/30' : ''}`}>
                          <div className="flex items-center justify-between pr-2">
                             <Accordion type='single' collapsible className='w-full'>
                              <AccordionItem value={student.studentId} className='border-b-0'>
                                <AccordionTrigger className='p-2 py-4 hover:no-underline'>
                                  <div className='flex flex-col items-start text-left'>
                                    <span className={`font-medium ${atRiskInfo ? 'text-red-700' : 'text-slate-700'}`}>
                                      {student.studentName}
                                    </span>
                                    <span className='text-xs font-normal text-slate-400'>
                                      ID: {student.studentId.substring(0, 6)}...
                                    </span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className='px-2 text-xs text-slate-500'>Details for {student.studentName}</div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>

                            {/* RISK INDICATOR ICON */}
                            {atRiskInfo && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full animate-in zoom-in"
                                    onClick={() => setSelectedAnalysisStudent(atRiskInfo)}
                                  >
                                    <BrainCircuit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View AI Analysis</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TableCell>

                        {currentLesson.sectionIds.map((sectionId) => (
                          <TableCell
                            key={`${student.studentId}-${sectionId}`}
                            className={`h-[70px] border-r p-2 text-center ${COLUMN_WIDTH}`}
                          >
                            {renderSectionStatus(student, currentLesson.lessonId, sectionId)}
                          </TableCell>
                        ))}
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={currentLesson.sectionIds.length + 1}
                      className='h-24 text-center text-slate-500'
                    >
                      {filterAtRisk ? 'No at-risk students found.' : 'No students enrolled in this class.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* --- STUDENT ANALYSIS MODAL --- */}
      <Dialog open={!!selectedAnalysisStudent} onOpenChange={(open) => !open && setSelectedAnalysisStudent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
               <AlertTriangle className="h-5 w-5" />
               Risk Analysis
            </DialogTitle>
            <DialogDescription>
              AI Assessment for student ID: <span className="font-semibold text-slate-900">{selectedAnalysisStudent?.studentId.substring(0,8)}...</span>
            </DialogDescription>
          </DialogHeader>
          
          {selectedAnalysisStudent && (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border">
                 <span className="text-sm font-medium text-slate-500">Risk Severity</span>
                 <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600">
                   {selectedAnalysisStudent.currentStatus === 'AtRisk' ? 'High' : 'Medium'} Priority
                 </Badge>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-400" /> 
                  Identified Issues
                </h4>
                <div className="text-sm text-slate-600 bg-red-50 p-3 rounded-md border border-red-100">
                  {selectedAnalysisStudent.statusText}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                  Recommended Action
                </h4>
                <div className="text-sm text-slate-600 bg-green-50 p-3 rounded-md border border-green-100">
                  {selectedAnalysisStudent.interventionText}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2">
             <Button variant="outline" onClick={() => setSelectedAnalysisStudent(null)}>Close</Button>
             <Button className="bg-blue-600 hover:bg-blue-700">Assign Support Task</Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}