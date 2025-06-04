import React from 'react';
import { motion } from 'framer-motion';
import { Star, Users } from 'lucide-react'; // Users icon might not be used here, but kept from original

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

// Sample review data
const sampleReviews = [
  {
    id: 1,
    name: "Alice Wonderland",
    avatarPlaceholder: "AW", // Placeholder for initials or an actual image
    rating: 5,
    date: "March 15, 2024",
    text: "This course was absolutely fantastic! The content was thorough, easy to understand, and directly applicable. The instructor's explanations were clear and engaging. Highly recommended!",
  },
  {
    id: 2,
    name: "Bob The Builder",
    avatarPlaceholder: "BB",
    rating: 4,
    date: "February 28, 2024",
    text: "A very good course with a lot of valuable information. Some modules were a bit challenging, but the overall learning experience was positive. The practical examples were very helpful.",
  },
  {
    id: 3,
    name: "Charlie Brown",
    avatarPlaceholder: "CB",
    rating: 3,
    date: "February 10, 2024",
    text: "Decent course. Covered the basics well, but I was hoping for more advanced topics. Good for beginners.",
  }
];

export default function ReviewSection() {
  // Helper function to render stars based on rating
  const renderStars = (rating: number, starSize = "w-5 h-5") => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`${starSize} ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <motion.section 
      id="reviews"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
      className="py-16 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center lg:text-left"> {/* Moved title outside the grid for better flow */}
            <h2 className="text-3xl font-bold text-gray-900">Student Feedback</h2>
        </div>
        <div className="grid lg:grid-cols-3 gap-8 items-start"> {/* Changed to 3 columns for more review space */}
          
          {/* Column 1: Review Summary */}
          <div className="lg:col-span-1 bg-white rounded-lg p-6 shadow-lg"> {/* Enhanced shadow */}
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Course Rating</h3>
            <div className="flex items-center mb-6">
              <div className="text-5xl font-bold text-gray-900 mr-4">0.0</div> {/* Assuming 0.0 is placeholder */}
              <div>
                {renderStars(0)} {/* Assuming 0 rating for now */}
                <div className="text-sm text-gray-600 mt-1">Based on 0 Reviews</div>
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              {[5, 4, 3, 2, 1].map((ratingValue) => (
                <div key={ratingValue} className="flex items-center">
                  <span className="text-xs text-gray-500 w-6 text-right mr-2">{ratingValue} star</span>
                  <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2.5">
                    <div 
                        className="bg-yellow-400 h-2.5 rounded-full" 
                        style={{ width: '0%' }} // This would be dynamic
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">0%</span> {/* This would be dynamic */}
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors">
                + Add Your Review
              </button>
            </div>
          </div>

          {/* Column 2 & 3: Actual Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {sampleReviews.length > 0 ? (
              sampleReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg p-6 shadow-lg"> {/* Enhanced shadow */}
                  <div className="flex items-start mb-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold mr-4 flex-shrink-0">
                      {review.avatarPlaceholder}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-md font-semibold text-gray-800">{review.name}</h4>
                      <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                    {renderStars(review.rating, "w-4 h-4")}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {review.text}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg p-6 shadow-lg text-center">
                <p className="text-gray-600">No reviews yet. Be the first to add one!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};