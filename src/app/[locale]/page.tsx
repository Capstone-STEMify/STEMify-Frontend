import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import HomePage from '@/features/home/components/HomePage'

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Header />
      <HomePage />
      <Footer />
    </div>
  )
}
