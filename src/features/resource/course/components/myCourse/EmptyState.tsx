// components/MyLearning/EmptyState.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Search, RefreshCw } from 'lucide-react'

interface EmptyStateProps {
  onClearFilters: () => void
  searchTerm: string
  hasFilters: boolean
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  onClearFilters, 
  searchTerm, 
  hasFilters 
}) => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        stiffness: 200,
        damping: 20
      }
    }
  }

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity
      }
    }
  }

  return (
    <motion.div 
      className='text-center py-16 bg-white rounded-xl shadow-sm'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className='mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6'
        variants={iconVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={floatingVariants}
          animate="animate"
        >
          {searchTerm ? (
            <Search className='h-12 w-12 text-blue-500' />
          ) : (
            <BookOpen className='h-12 w-12 text-blue-500' />
          )}
        </motion.div>
      </motion.div>

      <motion.h3 
        className='text-xl font-semibold text-gray-800 mb-2'
        variants={itemVariants}
      >
        {searchTerm ? 'No Search Results' : 'No Courses Found'}
      </motion.h3>

      <motion.p 
        className='text-gray-600 max-w-md mx-auto mb-6'
        variants={itemVariants}
      >
        {searchTerm 
          ? `We couldn't find any courses matching "${searchTerm}". Try searching with different keywords or check your filters.`
          : hasFilters 
          ? 'No courses match your current filters. Try adjusting your search criteria.'
          : 'You haven\'t enrolled in any courses yet. Start your learning journey today!'
        }
      </motion.p>

      <motion.div 
        className='flex flex-col sm:flex-row gap-3 justify-center'
        variants={itemVariants}
      >
        <motion.button
          className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 justify-center font-medium'
          onClick={onClearFilters}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className='h-4 w-4' />
          {searchTerm || hasFilters ? 'Clear Filters' : 'Browse Courses'}
        </motion.button>

        {!searchTerm && !hasFilters && (
          <motion.button
            className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Catalog
          </motion.button>
        )}
      </motion.div>

      {/* Decorative elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <motion.div
          className='absolute top-10 left-10 w-2 h-2 bg-blue-200 rounded-full'
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className='absolute top-20 right-20 w-3 h-3 bg-purple-200 rounded-full'
          animate={{
            x: [0, -15, 0],
            y: [0, 15, 0],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className='absolute bottom-20 left-20 w-1 h-1 bg-indigo-200 rounded-full'
          animate={{
            x: [0, 10, 0],
            y: [0, -10, 0],
            opacity: [0.4, 0.9, 0.4]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
    </motion.div>
  )
}

export default EmptyState