import React from 'react'
import { motion } from 'framer-motion'

const ProductDescription: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className='rounded-3xl bg-white p-10 shadow-xl'
    >
      <h2 className='mb-6 text-3xl font-bold text-gray-900'>Product Description</h2>
      <div className='space-y-6 leading-relaxed text-gray-600'>
        <p className='text-lg'>
          Immerse yourself in premium audio quality with our state-of-the-art wireless headphones. Engineered for
          audiophiles and everyday listeners alike, these headphones deliver crystal-clear sound with deep bass and
          crisp highs.
        </p>

        <div className='grid gap-6 md:grid-cols-2'>
          <div>
            <h3 className='mb-3 text-xl font-bold text-gray-900'>Key Features</h3>
            <ul className='space-y-2 text-gray-600'>
              <li className='flex items-start gap-2'>
                <span className='font-bold text-blue-500'>•</span>
                <span>Active Noise Cancellation (ANC) technology</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='font-bold text-blue-500'>•</span>
                <span>40-hour battery life on a single charge</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='font-bold text-blue-500'>•</span>
                <span>Premium memory foam ear cushions</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='font-bold text-blue-500'>•</span>
                <span>Bluetooth 5.3 with multipoint connection</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='mb-3 text-xl font-bold text-gray-900'>Specifications</h3>
            <ul className='space-y-2 text-gray-600'>
              <li className='flex justify-between'>
                <span className='font-semibold'>Driver Size:</span>
                <span>40mm</span>
              </li>
              <li className='flex justify-between'>
                <span className='font-semibold'>Frequency:</span>
                <span>20Hz - 20kHz</span>
              </li>
              <li className='flex justify-between'>
                <span className='font-semibold'>Impedance:</span>
                <span>32 Ohms</span>
              </li>
              <li className='flex justify-between'>
                <span className='font-semibold'>Weight:</span>
                <span>250g</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductDescription
