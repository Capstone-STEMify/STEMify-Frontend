import { motion } from 'framer-motion';

export default function HeroSection () {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600 p-12 md:p-20"
    >
      <div className="relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-4 text-5xl font-bold text-white md:text-7xl"
        >
          Discover Premium
          <br />
          <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
            Collections
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-8 max-w-2xl text-lg text-purple-100 md:text-xl"
        >
          Experience the future of shopping with our curated selection of cutting-edge products
        </motion.p>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-full bg-white px-8 py-4 font-semibold text-purple-900 shadow-lg transition hover:shadow-xl"
        >
          Explore Now
        </motion.button>
      </div>
      <div className="absolute right-0 top-0 h-full w-1/2 opacity-20">
        <div className="absolute right-20 top-20 h-64 w-64 rounded-full bg-white blur-3xl"></div>
        <div className="absolute bottom-20 right-40 h-96 w-96 rounded-full bg-pink-300 blur-3xl"></div>
      </div>
    </motion.section>
  );
};