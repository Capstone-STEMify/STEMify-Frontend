import React from 'react'
import { motion } from 'framer-motion'
import { Star, Users } from 'lucide-react' // Users icon might not be used here, but kept from original

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
}

// Sample review data
const sampleReviews = [
  {
    id: 1,
    name: 'Alice Wonderland',
    avatarPlaceholder: 'AW',
    rating: 5,
    date: 'March 15, 2024',
    text: "This course was absolutely fantastic! The content was thorough, easy to understand, and directly applicable. The instructor's explanations were clear and engaging. Highly recommended!"
  },
  {
    id: 2,
    name: 'Bob The Builder',
    avatarPlaceholder: 'BB',
    rating: 4,
    date: 'February 28, 2024',
    text: 'A very good course with a lot of valuable information. Some modules were a bit challenging, but the overall learning experience was positive. The practical examples were very helpful.'
  },
  {
    id: 3,
    name: 'Charlie Brown',
    avatarPlaceholder: 'CB',
    rating: 3,
    date: 'February 10, 2024',
    text: 'Decent course. Covered the basics well, but I was hoping for more advanced topics. Good for beginners.'
  }
]

export default function ReviewSection() {
  // Helper function to render stars based on rating
  const renderStars = (rating: number, starSize = 'w-5 h-5') => {
    return (
      <div className='flex items-center'>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    )
  }

  return (
    <motion.section
      id='reviews'
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true }}
      variants={fadeInUp}
      className='bg-gray-50 py-16'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-10 text-center lg:text-left'>
          <h2 className='text-3xl font-bold text-gray-900'>Student Feedback</h2>
        </div>
        <div className='grid items-start gap-8 lg:grid-cols-3'>
          <div className='rounded-lg bg-white p-6 shadow-lg lg:col-span-1'>
            <h3 className='mb-6 text-xl font-semibold text-gray-800'>Course Rating</h3>
            <div className='mb-6 flex items-center'>
              <div className='mr-4 text-5xl font-bold text-gray-900'>0.0</div>
              <div>
                {renderStars(0)}
                <div className='mt-1 text-sm text-gray-600'>Based on 0 Reviews</div>
              </div>
            </div>

            <div className='mb-6 space-y-2'>
              {[5, 4, 3, 2, 1].map((ratingValue) => (
                <div key={ratingValue} className='flex items-center'>
                  <span className='mr-2 w-6 text-right text-xs text-gray-500'>{ratingValue} star</span>
                  <div className='mx-2 h-2.5 flex-1 rounded-full bg-gray-200'>
                    <div className='h-2.5 rounded-full bg-yellow-400' style={{ width: '0%' }}></div>
                  </div>
                  <span className='w-8 text-right text-xs text-gray-500'>0%</span>
                </div>
              ))}
            </div>

            <div className='mt-6 border-t border-gray-200 pt-6'>
              <button className='w-full rounded-lg bg-sky-400 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-500'>
                + Add Your Review
              </button>
            </div>
          </div>

          <div className='space-y-6 lg:col-span-2'>
            {sampleReviews.length > 0 ? (
              sampleReviews.map((review) => (
                <div key={review.id} className='rounded-lg bg-white p-6 shadow-lg'>
                  <div className='mb-3 flex items-start'>
                    <div className='mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600'>
                      {review.avatarPlaceholder}
                    </div>
                    <div className='flex-1'>
                      <h4 className='text-md font-semibold text-gray-800'>{review.name}</h4>
                      <p className='text-xs text-gray-500'>{review.date}</p>
                    </div>
                    {renderStars(review.rating, 'w-4 h-4')}
                  </div>
                  <p className='text-sm leading-relaxed text-gray-700'>{review.text}</p>
                </div>
              ))
            ) : (
              <div className='rounded-lg bg-white p-6 text-center shadow-lg'>
                <p className='text-gray-600'>No reviews yet. Be the first to add one!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
