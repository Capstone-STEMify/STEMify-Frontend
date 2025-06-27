import HeroSection from '@/components/shared/hero-section/HeroSection'
import LinkButton from '@/components/shared/button/LinkButton'
import LessonSection from '@/features/resource/lesson/components/list/LessonSection'
import ActivitySection from '@/features/resource/activity/components/list/ActivitySection'
import CourseSection from '@/features/resource/course/components/list/CourseSection'

export default function ResourcePage() {
  return (
    <main className='bg-light mt-24 min-h-screen'>
      <HeroSection />

      {/* Main content layout */}
      <div className='mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12'>
        <SectionWrapper
          id='resources'
          title='Explore Courses'
          description='Discover a wide range of courses designed to enhance your skills and knowledge. Whether you are looking to learn something new or deepen your understanding, we have the right course for you.'
        >
          <CourseSection />
        </SectionWrapper>

        <SectionWrapper
          id='lessons'
          title='Latest Lessons'
          description='Discover a variety of resources designed to enhance your learning experience. From comprehensive courses to
          engaging lessons and fun activities, we have something for everyone.'
        >
          <LessonSection />
        </SectionWrapper>

        <SectionWrapper
          id='activities'
          title='Fun Activities'
          description='Engage in interactive activities that make learning fun and enjoyable. Explore our collection of activities designed to reinforce your knowledge and skills through hands-on experiences.'
        >
          <ActivitySection />
        </SectionWrapper>
      </div>
    </main>
  )
}

function SectionWrapper({
  children,
  description,
  id,
  title
}: {
  id: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className='space-y-8 py-10'>
      <div className='space-y-4 text-center'>
        <h2 className='text-skye-custom-600 text-3xl font-bold'>{title}</h2>
        <p className='mx-auto max-w-3xl text-gray-600'>{description}</p>
      </div>
      {children}
      <div className='mx-auto w-fit'>
        <LinkButton className='bg-skye-custom-300 rounded-2xl p-6 text-lg' href='/search'>
          Explore More
        </LinkButton>
      </div>
    </section>
  )
}
