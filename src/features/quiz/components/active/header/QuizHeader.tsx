import { Tabs, TabsList, TabsTrigger } from '@/components/shadcn/tabs'

export function QuizHeader() {
  return (
    <div>
      <h1 className='text-2xl font-bold tracking-tight'>Quiz</h1>
      <Tabs defaultValue='active' className='mt-4'>
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='active'>Active</TabsTrigger>
          <TabsTrigger value='progress'>Progress</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
