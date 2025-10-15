'use client'
import { useMediaQuery } from "@/hooks/useMediaQuery";
import ContactForm from "./form/ContactForm";
import SocialIcons from "./icon/SocialIcons";
import ContactInfo from "./info/ContactInfo";
import Footer from "@/components/layout/Footer";

const ContactUs = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  return (
    <div className="min-h-screen flex items-center justify-center lg:p-4">
      <main className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row overflow-hidden pt-15">
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
  );
};

export default ContactUs;