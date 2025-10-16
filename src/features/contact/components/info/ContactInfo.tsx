// src/components/ContactInfo.tsx
'use client'
import { motion, type Variants } from 'framer-motion'
import Image from 'next/image'
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi'

const ContactInfo = () => {
  const infoVariants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: 0.2,
        ease: 'easeInOut'
      }
    }
  }

  const contactDetails = [
    { icon: <FiMapPin />, text: '11 Đ. T12, Long Bình, Thủ Đức, Hồ Chí Minh, Việt Nam' },
    { icon: <FiPhone />, text: '+2034 4040 3030' },
    { icon: <FiMail />, text: 'stemify30062025@gmail.com' }
  ]

  return (
    <motion.div
      className='flex w-full flex-col items-center justify-center px-8'
      variants={infoVariants}
      initial='hidden'
      animate='visible'
    >
      <div className='relative w-full max-w-md'>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 120 }}
        >
          <Image
            src='/images/contact-image.jpg'
            alt='Contact Us Illustration'
            width={700}
            height={700}
            className='rounded-lg'
            priority
          />
        </motion.div>
      </div>

      <div className='mt-12 w-full space-y-6 text-left'>
        {contactDetails.map((detail, index) => (
          <motion.div
            key={index}
            className='flex items-center gap-4 text-gray-700'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
          >
            <span className='text-xl text-sky-400'>{detail.icon}</span>
            <span className='font-semibold'>{detail.text}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default ContactInfo
