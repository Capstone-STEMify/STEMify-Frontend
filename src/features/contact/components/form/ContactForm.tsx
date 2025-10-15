// src/components/ContactForm.tsx
'use client'
import { motion, type Variants } from 'framer-motion'

const ContactForm = () => {
  const formVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeInOut' }
    }
  }

  return (
    <motion.div
      className='flex w-full flex-col px-24 lg:w-1/2'
      variants={formVariants}
      initial='hidden'
      animate='visible'
    >
      <h2 className='mb-3 text-4xl font-semibold text-sky-400'>Get in touch</h2>
      <p className='mb-12 font-semibold text-gray-600'>We are here for you! How can we help?</p>
      <form className='flex flex-grow flex-col'>
        <div className='mb-6'>
          <label htmlFor='name' className='mb-3 block font-semibold text-gray-700'>
            Name
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type='text'
            id='name'
            className='w-full rounded-lg border border-sky-400 px-4 py-3 focus:ring-2 focus:ring-sky-400 focus:outline-none'
          />
        </div>
        <div className='mb-6'>
          <label htmlFor='email' className='mb-3 block font-semibold text-gray-700'>
            Email
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type='email'
            id='email'
            className='w-full rounded-lg border border-sky-400 px-4 py-3 focus:ring-2 focus:ring-sky-400 focus:outline-none'
          />
        </div>
        <div className='mb-8'>
          <label htmlFor='message' className='mb-3 block font-semibold text-gray-700'>
            Message
          </label>
          <motion.textarea
            whileFocus={{ scale: 1.02 }}
            id='message'
            rows={4}
            className='w-full rounded-lg border border-sky-400 px-4 py-3 focus:ring-2 focus:ring-sky-400 focus:outline-none'
          ></motion.textarea>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0px 0px 12px rgb(160,32,240)' }}
          whileTap={{ scale: 0.95 }}
          type='submit'
          className='hover:bg-opacity-90 mt-auto mb-10 w-full rounded-lg bg-sky-400 px-6 py-3 font-bold text-white transition-all duration-300 md:mb-0'
        >
          Submit
        </motion.button>
      </form>
    </motion.div>
  )
}

export default ContactForm
