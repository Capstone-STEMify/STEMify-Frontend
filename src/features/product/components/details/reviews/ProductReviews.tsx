import React from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const ProductReviews: React.FC = () => {
  const reviews = [
    {
      name: 'John Smith',
      rating: 5,
      text: "Amazing sound quality! Best headphones I've ever owned.",
      date: '2 days ago'
    },
    {
      name: 'Sarah Johnson',
      rating: 5,
      text: 'The noise cancellation is incredible. Perfect for travel.',
      date: '1 week ago'
    },
    {
      name: 'Mike Chen',
      rating: 4,
      text: 'Great product, battery life is as advertised. Comfortable too.',
      date: '2 weeks ago'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className='rounded-3xl bg-white p-10 shadow-xl'
    >
      <h2 className='mb-8 text-3xl font-bold text-gray-900'>Customer Reviews</h2>
      <div className='space-y-6'>
        {reviews.map((review, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className='border-b border-gray-200 pb-6 last:border-0'
          >
            <div className='mb-3 flex items-center justify-between'>
              <div>
                <h4 className='text-lg font-bold text-gray-900'>{review.name}</h4>
                <div className='mt-1 flex items-center gap-2'>
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                  ))}
                </div>
              </div>
              <span className='text-sm text-gray-500'>{review.date}</span>
            </div>
            <p className='leading-relaxed text-gray-600'>{review.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default ProductReviews
