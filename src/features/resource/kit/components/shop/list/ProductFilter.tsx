import React from 'react'
import { motion } from 'framer-motion'

const FilterSection: React.FC<{
  categories: string[]
  activeCategory: string
  onCategoryChange: (cat: string) => void
}> = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className='mx-auto mb-12 max-w-7xl px-4 sm:px-6 lg:px-8'
    >
      <div className='flex flex-wrap gap-3'>
        {categories.map((category, index) => (
          <motion.button
            key={category}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(category)}
            className={`rounded-full px-6 py-3 font-medium transition ${
              activeCategory === category
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </motion.section>
  )
}

export default FilterSection
