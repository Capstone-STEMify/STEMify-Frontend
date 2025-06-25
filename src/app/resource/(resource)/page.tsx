import HeroSection from '@/components/shared/hero-section/HeroSection'
import LinkButton from '@/components/shared/button/LinkButton'
import LessonSection from '@/features/resource/lesson/components/list/LessonSection'
import ActivitySection from '@/features/resource/activity/components/list/ActivitySection'
import CourseSection from '@/features/resource/course/components/list/CourseSection'

export default function ResourcePage() {
  return (
    <main className='bg-light min-h-screen'>
      <HeroSection />

      {/* Main content layout */}
      <div className='mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12'>
        <SectionWrapper id='resources' title='Explore Courses'>
          <CourseSection />
        </SectionWrapper>

        <SectionWrapper id='lessons' title='Latest Lessons'>
          <LessonSection />
        </SectionWrapper>

        <SectionWrapper id='activities' title='Fun Activities'>
          <ActivitySection />
        </SectionWrapper>
      </div>
    </main>
  )
}

function SectionWrapper({ children, id, title }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className='space-y-8 py-10'>
      <h2 className='text-skye-custom-600 text-3xl font-bold'>{title}</h2>
      {children}
      <div className='mx-auto w-fit'>
        <LinkButton className='bg-amber-custom-400 rounded-2xl p-6 text-lg' href='/resources/courses'>
          Explore More
        </LinkButton>
      </div>
    </section>
  )
}
