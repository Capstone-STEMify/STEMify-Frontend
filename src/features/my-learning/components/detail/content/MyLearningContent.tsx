import MyLearningAction from '@/features/my-learning/components/detail/content/shared/MyLearningAction'
import { dummyCardData } from '@/utils/mockData'

export default function MyLearningContent() {
  return (
    <div className='container mx-auto max-w-7xl space-y-8 p-4'>
      <MyLearningAction />

      <div className='grid grid-cols-1 gap-x-14 gap-y-8 lg:grid-cols-2 xl:grid-cols-4'>
        {dummyCardData.map((course, index) => {
          return <div key={index}>hhhh</div>
        })}
      </div>
    </div>
  )
}
