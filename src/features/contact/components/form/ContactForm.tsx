// src/components/ContactForm.tsx
"use client";
import { motion, type Variants } from "framer-motion";

const ContactForm = () => {
  const formVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      className="w-full lg:w-1/2 px-24 py-8 flex flex-col"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-4xl font-semibold mb-3 text-sky-400">Get in touch</h2>
      <p className="text-gray-600 font-semibold mb-12">We are here for you! How can we help?</p>
      <form className="flex flex-col flex-grow">
        <div className="mb-6">
          <label htmlFor="name" className="block font-semibold text-gray-700 mb-3">Name</label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            id="name"
            className="w-full px-4 py-3 border border-sky-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="email" className="block font-semibold text-gray-700 mb-3">Email</label>
          <motion.input
             whileFocus={{ scale: 1.02 }}
            type="email"
            id="email"
            className="w-full px-4 py-3 border border-sky-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
        <div className="mb-8">
          <label htmlFor="message" className="block font-semibold text-gray-700 mb-3">Message</label>
          <motion.textarea
            whileFocus={{ scale: 1.02 }}
            id="message"
            rows={4}
            className="w-full px-4 py-3 border border-sky-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
          ></motion.textarea>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgb(160,32,240)" }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-sky-400 text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-300 mt-auto"
        >
          Submit
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ContactForm;