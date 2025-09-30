import React from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react";

const ProductReviews: React.FC = () => {
  const reviews = [
    { name: 'John Smith', rating: 5, text: 'Amazing sound quality! Best headphones I\'ve ever owned.', date: '2 days ago' },
    { name: 'Sarah Johnson', rating: 5, text: 'The noise cancellation is incredible. Perfect for travel.', date: '1 week ago' },
    { name: 'Mike Chen', rating: 4, text: 'Great product, battery life is as advertised. Comfortable too.', date: '2 weeks ago' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-3xl p-10 shadow-xl"
    >
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Customer Reviews</h2>
      <div className="space-y-6">
        {reviews.map((review, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="border-b border-gray-200 pb-6 last:border-0"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-bold text-lg text-gray-900">{review.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <span className="text-sm text-gray-500">{review.date}</span>
            </div>
            <p className="text-gray-600 leading-relaxed">{review.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProductReviews;