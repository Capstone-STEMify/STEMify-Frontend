import ContactForm from "./form/ContactForm";
import SocialIcons from "./icon/SocialIcons";
import ContactInfo from "./info/ContactInfo";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <main className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl flex flex-col lg:flex-row overflow-hidden">
        <ContactForm />
        <ContactInfo />
      </main>
      <SocialIcons />
    </div>
  );
};

export default ContactUs;