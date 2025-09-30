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
    </motion.div>
  );
};

export default ProductGallery;