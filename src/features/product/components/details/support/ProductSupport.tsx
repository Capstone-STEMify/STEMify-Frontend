import React from "react";
import { motion } from "framer-motion";

const SoftwareSupport: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-3xl p-10 relative overflow-hidden max-w-7xl mx-auto" 
    >
       <h2 className="text-4xl font-semibold text-gray-900 text-center mb-12">
        Supporting You All the Way with<br />Easy-to-Use Softwares
       </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className="relative md:row-span-2 rounded-3xl overflow-hidden px-4 py-8">
            <motion.div 
              className="relative rounded-2xl overflow-hidden transform transition-transform duration-300 h-fit"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <motion.img 
                src="https://cdn.shopify.com/s/files/1/0070/5901/3716/files/Gamified_Coding.jpg?v=1731390857&width=2048" 
                alt="Gamified Coding Interface"
                className="w-full h-auto object-cover"
                whileHover={{ scale: 1.05 }}
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-500 font-bold text-xl hover:bg-blue-500 hover:text-white transition-colors duration-300"
            >
              +
            </motion.button>
        </div>

        <div className="relative rounded-3xl overflow-hidden p-4">
            <motion.div 
              className="relative rounded-2xl overflow-hidden transform transition-transform duration-300"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <motion.img 
                src="https://cdn.shopify.com/s/files/1/0070/5901/3716/files/Fun-filled_Playing_0d96b89c-2c97-467c-85ed-f0d947faec8c.jpg?v=1731390857&width=2048" 
                alt="Fun-filled Playing Interface"
                className="w-full h-auto object-cover"
                whileHover={{ scale: 1.05 }}
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-500 font-bold text-xl hover:bg-blue-500 hover:text-white transition-colors duration-300"
            >
              +
            </motion.button>
        </div>

        <div className="relative rounded-3xl overflow-hidden p-4">
            <motion.div 
              className="relative rounded-2xl overflow-hidden transform transition-transform duration-300"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <motion.img 
                src="https://cdn.shopify.com/s/files/1/0070/5901/3716/files/Easy_Building.jpg?v=1731390864&width=2048" 
                alt="Easy Building Interface"
                className="w-full h-auto object-cover"
                whileHover={{ scale: 1.05 }}
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-500 font-bold text-xl hover:bg-blue-500 hover:text-white transition-colors duration-300"
            >
              +
            </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default SoftwareSupport;