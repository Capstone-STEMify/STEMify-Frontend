import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const WhatsIncluded: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const items = [
    { name: 'CyberPi', quantity: 'x 1', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop' },
    { name: 'mBot2 Shield', quantity: 'x 1', image: 'https://images.unsplash.com/photo-1589561084283-930aa7b7b9b4?w=200&h=200&fit=crop' },
    { name: 'Ultrasonic sensor 2', quantity: 'x 1', image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=200&h=200&fit=crop' },
    { name: 'Quad RGB sensor', quantity: 'x 1', image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=200&h=200&fit=crop' },
    { name: 'Encoder motor', quantity: 'x 1', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=200&h=200&fit=crop' },
    { name: 'Chassis', quantity: 'x 1', image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=200&h=200&fit=crop' },
    { name: 'Mini wheel', quantity: 'x 1', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop' },
    { name: 'Slick tyre', quantity: 'x 1', image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=200&h=200&fit=crop' },
    { name: 'Wheel hub', quantity: 'x 1', image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=200&h=200&fit=crop' },
    { name: 'USB cable', quantity: 'x 1', image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=200&h=200&fit=crop' },
    { name: 'Screwdriver', quantity: 'x 1', image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=200&h=200&fit=crop' },
    { name: 'Line-following track map', quantity: 'x 1', image: 'https://images.unsplash.com/photo-1569144157591-c60f3f82f137?w=200&h=200&fit=crop' },
    { name: 'Screw and Bolt Pack', quantity: 'x 1', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&h=200&fit=crop' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-3xl p-10 shadow-xl"
    >
      <div 
        className="flex items-center justify-between cursor-pointer mb-8"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-4xl font-semibold text-gray-900">What's Included</h2>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-8 h-8 text-gray-600" />
        </motion.div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-900">mBot2 Coding Kit</h3>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="flex flex-col items-center"
            >
              <div className="w-full aspect-square bg-gray-50 rounded-xl flex items-center justify-center mb-2 overflow-hidden p-2">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <h4 className="font-medium text-gray-900 text-center text-xs mb-1 leading-tight">{item.name}</h4>
              <p className="text-gray-500 text-xs">{item.quantity}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WhatsIncluded;