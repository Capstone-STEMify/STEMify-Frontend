'use client'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import ContactForm from './form/ContactForm'
import SocialIcons from './icon/SocialIcons'
import ContactInfo from './info/ContactInfo'
import Footer from '@/components/layout/Footer'

const ContactUs = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  return (
    <div className='flex min-h-screen items-center justify-center lg:p-4'>
      <main className='mx-auto flex w-full max-w-7xl flex-col overflow-hidden pt-15 lg:flex-row'>
        <ContactForm />

        {isDesktop ? (
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
