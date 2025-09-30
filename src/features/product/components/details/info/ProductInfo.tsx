import React, { useState } from "react";
import { motion  } from "framer-motion";
import { ChevronDown, HandCoins, RotateCcw, Shield, ShoppingCart, Star, Truck } from "lucide-react";
import Image from "next/image";

const ProductInfo: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState('mBot2');
  const [selectedBundle, setSelectedBundle] = useState('1-robot');
  const [showMore, setShowMore] = useState(false);

  const products = [
    { id: 'mBot2', name: 'mBot2' },
    { id: 'rover', name: 'mBot2 Rover Kit' },
    { id: 'smart', name: 'mBot2 Smart World Bundle' },
    { id: 'competition', name: 'mBot2 Competition Bundle' },
    { id: 'coding', name: 'mBot2 Coding Bundle' }
  ];

  const bundles = [
    { 
      id: '1-robot', 
      name: '1 Robot', 
      price: 149.99, 
      originalPrice: 177.99,
      description: 'Contains 1 Makeblock mBot2 Coding Robot Pack and Free Gift',
      gift: 'Free Gift: mBot2 Standard Coding Box x1 ($19.99)',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop'
    },
    { 
      id: '3-robots', 
      name: '3 Robots', 
      price: 449.99, 
      originalPrice: 533.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop'
    },
    { 
      id: '6-robots', 
      name: '1 mBot2 Classroom Pack (6 Robots)', 
      price: 1199.99, 
      originalPrice: 1444.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop'
    },
    { 
      id: '12-robots', 
      name: '2 mBot2 Classroom Packs (12 Robots)', 
      price: 2399.99, 
      originalPrice: 2889.99,
      badge: 'New release! Perfect for classroom teaching',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop'
    }
  ];

  const selectedBundleData = bundles.find(b => b.id === selectedBundle);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-3 leading-tight"
        >
          Makeblock mBot2: STEM Education Coding Robot Kit for AI Learning
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-gray-600 text-sm font-medium">173 reviews</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-3 mb-4"
        >
          <span className="text-4xl font-semibold text-red-600">${selectedBundleData?.price}</span>
          <span className="text-xl text-gray-400 line-through">${selectedBundleData?.originalPrice}</span>
          <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
            Final: $139.99
          </span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-2 mb-6 bg-gray-50 p-3 rounded-xl"
        >
          <HandCoins className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-gray-700">
            Earn up to 10% cash back. <span className="text-blue-600 font-semibold cursor-pointer">Join Now.</span>
          </span>
        </motion.div>
      </div>

      {/* Buy More Save More */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-yellow-50 to-orange-50 p-5 rounded-2xl border-2 border-yellow-200"
      >
        <h3 className="font-bold text-lg mb-3 text-gray-900">Buy More, Save More</h3>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[
            { amount: '$20', save: '$20' },
            { amount: '$40', save: '$100' },
            { amount: '$100', save: '$200' },
            { amount: '$300', save: '$500' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg p-2 text-center shadow-sm">
              <div className="text-xs font-bold text-gray-900">{item.amount} <span className="text-[10px]">OFF</span></div>
              <div className="text-[10px] text-gray-600">{item.save}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 text-xs bg-white/50 rounded-lg p-2">
          <div className="flex gap-1">
            <div className="bg-orange-500 text-white px-2 py-1 rounded font-bold">02</div>
            <span className="text-gray-600 text-[10px] pt-1">DAYS</span>
          </div>
          <span className="text-gray-600">:</span>
          <div className="flex gap-1">
            <div className="bg-orange-500 text-white px-2 py-1 rounded font-bold">04</div>
            <span className="text-gray-600 text-[10px] pt-1">HRS</span>
          </div>
          <span className="text-gray-600">:</span>
          <div className="flex gap-1">
            <div className="bg-orange-500 text-white px-2 py-1 rounded font-bold">10</div>
            <span className="text-gray-600 text-[10px] pt-1">MIN</span>
          </div>
          <span className="text-gray-600">:</span>
          <div className="flex gap-1">
            <div className="bg-orange-500 text-white px-2 py-1 rounded font-bold">18</div>
            <span className="text-gray-600 text-[10px] pt-1">SEC</span>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-3 text-center">
          Get $10 off automatically—buy more to save even more for back-to-school essentials!
        </p>
      </motion.div>

      {/* Product Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <span>Aluminum robot perfect for long-term use in classrooms and homeschooling.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <span>Use a smartphone, gamepad or auto-program to control. (Support Bluetooth & Wifi)</span>
          </li>
        </ul>
        <button 
          onClick={() => setShowMore(!showMore)}
          className="text-blue-600 font-semibold text-sm mt-3 flex items-center gap-1 hover:text-blue-700 transition-colors"
        >
          View More <ChevronDown className={`w-4 h-4 transition-transform ${showMore ? 'rotate-180' : ''}`} />
        </button>
      </motion.div>

      {/* Select Product */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <h3 className="text-lg font-bold mb-3 text-gray-900">Select the Product:</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {products.map((product) => (
            <motion.button
              key={product.id}
              onClick={() => setSelectedProduct(product.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl border-1 transition-all text-sm font-medium ${
                selectedProduct === product.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {product.name}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Classroom Bundle Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <h3 className="text-lg font-bold mb-3 text-gray-900">Classroom Bundle Options:</h3>
        <div className="space-y-3">
          {bundles.map((bundle) => (
            <motion.button
              key={bundle.id}
              onClick={() => setSelectedBundle(bundle.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full p-4 rounded-xl border-1 transition-all text-left ${
                selectedBundle === bundle.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {bundle.badge && (
                <div className="mb-2">
                  <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {bundle.badge}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image src={bundle.image} alt="pro-img" width={60} height={60} className="rounded-lg"/>
                  <div>
                    <div className="font-bold text-gray-900">{bundle.name}</div>
                    {bundle.description && (
                      <div className="text-xs text-gray-600 mt-1">{bundle.description}</div>
                    )}
                    {bundle.gift && (
                      <div className="text-xs text-green-600 mt-1">• {bundle.gift}</div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-gray-900">${bundle.price}</div>
                  <div className="text-sm text-gray-400 line-through">${bundle.originalPrice}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Quantity & Add to Cart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white rounded-full border border-gray-400 py-2 px-6">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full bg-gray-100 shadow-sm hover:shadow-md transition-all font-bold text-xl"
            >
              -
            </button>
            <span className="w-12 text-center font-semibold text-xl">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-full bg-gray-100 shadow-sm hover:shadow-md transition-all font-bold text-xl"
            >
              +
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-full font-bold text-lg shadow-xl shadow-blue-200 hover:shadow-2xl transition-all"
          >
            ADD TO CART
          </motion.button>
        </div>

        <p className="text-xs text-center text-gray-600">
          Click <span className="text-blue-600 underline cursor-pointer">here</span> to learn more about using a Purchase Order (PO).
        </p>
      </motion.div>

      {/* Delivery Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="space-y-4 pt-6 border-t border-gray-200"
      >
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Truck className="w-5 h-5 text-blue-600" />
          <span className="font-semibold">Buy with Prime for a Faster Delivery</span>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-gray-900">Safe & Secure Checkout</span>
            <div className="flex gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-5" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-semibold">Paypal</span>
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded text-xs font-semibold">Visa</span>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-xs font-semibold">Momo</span>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-5 h-5 text-yellow-600" />
            <span className="font-semibold text-gray-900">Ship in 2 Business Days</span>
          </div>
          <p className="text-sm text-gray-700 mb-3">with Trusted Delivery</p>
          <div className="flex gap-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/320px-Amazon_logo.svg.png" alt="Amazon" className="h-6" />
            <img src="https://www.fedex.com/content/dam/fedex-com/logos/logo.png" alt="FedEx" className="h-6" />
            <img src="https://www.ups.com/assets/resources/webcontent/images/ups-logo.svg" alt="UPS" className="h-6" />
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-bold">We are currently only able to deliver products to the contiguous VietNam.</span>
          </p>
          <p className="text-xs text-gray-600 mb-2">
            If you want to purchase products and deliver outside of the VN, we will forward your order to distributors to serve you.
          </p>
          <button className="text-blue-600 font-semibold text-xs underline">
            Please leave your details.
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};


export default ProductInfo;