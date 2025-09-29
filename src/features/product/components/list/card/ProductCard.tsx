import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProductData } from '@/features/product/components/list/mockData'

const ProductCard: React.FC<{ product: ProductData; index: number }> = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-4 w-4 ${
              star <= Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : star - 0.5 <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-300 text-gray-300'
            }`}
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {/* Image */}
        <motion.img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
          animate={{ opacity: isHovered ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Video Background on Hover */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isHovered && (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            >
              <source src={product.video} type="video/mp4" />
            </video>
          )}
        </motion.div>

        {/* Overlay Gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Category Badge */}
        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800 backdrop-blur-sm">
            {product.category}
          </span>
        </div>

        {/* Quick View Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-lg transition hover:bg-gray-100"
        >
          Quick View
        </motion.button>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="mb-2 text-xl font-bold text-gray-900">{product.name}</h3>
        <p className="mb-4 text-sm text-gray-600">{product.description}</p>
        <div className="mb-3 flex items-center gap-2">
            <StarRating rating={product.rating} />
            <span className="text-sm font-medium text-gray-400 drop-shadow-md">
              {product.rating} ({product.reviews})
            </span>
          </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">${product.price}</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-full border-2 border-blue-600 bg-white px-5 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Add to Cart/Quote
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;