'use client'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Plus, FileText } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'

const Index = () => {
  const router = useRouter()
  const locale = useLocale()

  return (
    <div className='from-background via-background to-muted/30 bg-gradient-to-br'>
      <div className='container mx-auto px-4 py-16'>
        <div className='mx-auto max-w-4xl'>
          <div className='mb-12 text-center'>
            <h1 className='from-primary to-accent mb-4 bg-gradient-to-r bg-clip-text text-5xl font-bold text-transparent'>
              Quiz Builder
            </h1>
            <p className='text-muted-foreground text-xl'>Create engaging quizzes with multiple question types</p>
          </div>

          <div className='grid gap-6 md:grid-cols-2'>
            <Card className='hover:border-primary cursor-pointer border-2 transition-all hover:shadow-lg'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Plus className='text-primary h-5 w-5' />
                  Create New Quiz
                </CardTitle>
                <CardDescription>Start building a new quiz from scratch</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => router.push(`/${locale}/admin/lesson/6/section/18/quiz/1/question`)}
                  className='w-full'
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className='border-2 transition-all hover:shadow-lg'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <FileText className='text-muted-foreground h-5 w-5' />
                  Your Quizzes
                </CardTitle>
                <CardDescription>View and manage your existing quizzes</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant='outline' className='w-full' disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
