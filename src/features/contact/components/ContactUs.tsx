'use client'
import ContactForm from './form/ContactForm'
import SocialIcons from './icon/SocialIcons'
import ContactInfo from './info/ContactInfo'
import Footer from '@/components/layout/Footer'
import { useIsMobile } from '@/hooks/use-mobile'

const ContactUs = () => {
  const isMobile = useIsMobile()
  return (
    <div className='mb-8 flex items-center justify-center'>
      <main className='mx-auto flex w-full max-w-7xl flex-col overflow-hidden pt-15 lg:flex-row'>
        <ContactForm />

        {!isMobile ? (
          <>
            <ContactInfo />
            <SocialIcons />
          </>
        ) : (
          <Footer />
        )}
      </main>
    </div>
  )
}

export default ContactUs
