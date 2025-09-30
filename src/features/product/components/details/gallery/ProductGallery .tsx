import React, { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

const ProductGallery: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=800&fit=crop'
  ];

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-8"
    >
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl overflow-hidden shadow-2xl">
        <div className="aspect-square relative">
          <motion.img
            key={currentImage}
            src={images[currentImage]}
            alt="Product"
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110">
            <Heart className="w-6 h-6 text-rose-500" />
          </button>
        </div>

        <div className="p-6 flex gap-3 justify-center">
          {images.map((img, idx) => (
            <motion.button
              key={idx}
              onClick={() => setCurrentImage(idx)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`w-20 h-20 rounded-xl overflow-hidden border-3 transition-all ${
                currentImage === idx ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-200'
              }`}
            >
              <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="border-t border-gray-200 mt-8 pt-4"
      >
        <div className="grid grid-cols-4 gap-4 mb-4">
          {[
            { 
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="6" width="18" height="12" rx="2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ), 
              text: 'Secure Payment' 
            },
            { 
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ), 
              text: '12-month Warranty' 
            },
            { 
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="1" y="3" width="15" height="13" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 8a4 4 0 0 1 8 0v8h-8V8z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="5.5" cy="18.5" r="2.5" strokeWidth="1.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5" strokeWidth="1.5"/>
                </svg>
              ), 
              text: 'Free Shipping' 
            },
            { 
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
                  <path d="M12 6v6l4 2" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M16.24 7.76l-1.41 1.41M7.76 16.24l1.41-1.41" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ), 
              text: '30-day Return & Refund' 
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + idx * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="text-gray-400 mb-3">
                {feature.icon}
              </div>
              <span className="text-sm font-semibold text-gray-700 leading-tight">{feature.text}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="pt-6 border-t border-gray-200 flex items-center justify-center gap-2 text-blue-500 hover:text-blue-600 cursor-pointer transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium">
            Questions about products? Contact us for support.
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProductGallery;