import FeedbackCard from '@/components/shared/card/FeedbackCard'
import LoadingSkeleton from '@/components/shared/skeleton/LoadingSkeleton'

export default function SonnerDemo() {
  const title = 'Feedback Card Example'
  const description = 'This is an example of a feedback card component.'
  const name = 'Jane Doe'
  const date = 'July 1, 2023'
  const rating = 4

  return (
    <div>
      <FeedbackCard src='ssssss' title={title} date={date} description={description} name={name} rating={rating} />
      <LoadingSkeleton />
    </div>
  )
}
