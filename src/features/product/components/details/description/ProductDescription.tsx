import React from "react"
import { motion } from "framer-motion";

const ProductDescription: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-3xl p-10 shadow-xl"
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Product Description</h2>
      <div className="space-y-6 text-gray-600 leading-relaxed">
        <p className="text-lg">
          Immerse yourself in premium audio quality with our state-of-the-art wireless headphones. 
          Engineered for audiophiles and everyday listeners alike, these headphones deliver 
          crystal-clear sound with deep bass and crisp highs.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-xl mb-3 text-gray-900">Key Features</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Active Noise Cancellation (ANC) technology</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>40-hour battery life on a single charge</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Premium memory foam ear cushions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Bluetooth 5.3 with multipoint connection</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-xl mb-3 text-gray-900">Specifications</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex justify-between">
                <span className="font-semibold">Driver Size:</span>
                <span>40mm</span>
              </li>
              <li className="flex justify-between">
                <span className="font-semibold">Frequency:</span>
                <span>20Hz - 20kHz</span>
              </li>
              <li className="flex justify-between">
                <span className="font-semibold">Impedance:</span>
                <span>32 Ohms</span>
              </li>
              <li className="flex justify-between">
                <span className="font-semibold">Weight:</span>
                <span>250g</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDescription;