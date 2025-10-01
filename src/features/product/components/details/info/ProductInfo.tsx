import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, HandCoins, RotateCcw, Shield, ShoppingCart, Star, Truck } from 'lucide-react'
import Image from 'next/image'

const ProductInfo: React.FC = () => {
  const [quantity, setQuantity] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState('mBot2')
  const [selectedBundle, setSelectedBundle] = useState('1-robot')
  const [showMore, setShowMore] = useState(false)

  const products = [
    { id: 'mBot2', name: 'mBot2' },
    { id: 'rover', name: 'mBot2 Rover Kit' },
    { id: 'smart', name: 'mBot2 Smart World Bundle' },
    { id: 'competition', name: 'mBot2 Competition Bundle' },
    { id: 'coding', name: 'mBot2 Coding Bundle' }
  ]

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
  ]

  const selectedBundleData = bundles.find((b) => b.id === selectedBundle)

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className='space-y-6'
    >
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='mb-3 text-3xl leading-tight font-semibold text-gray-900 lg:text-4xl'
        >
          Makeblock mBot2: STEM Education Coding Robot Kit for AI Learning
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='mb-4 flex items-center gap-3'
        >
          <div className='flex items-center gap-1'>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className='h-4 w-4 fill-yellow-400 text-yellow-400' />
            ))}
          </div>
          <span className='text-sm font-medium text-gray-600'>173 reviews</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className='mb-4 flex items-center gap-3'
        >
          <span className='text-4xl font-semibold text-red-600'>${selectedBundleData?.price}</span>
          <span className='text-xl text-gray-400 line-through'>${selectedBundleData?.originalPrice}</span>
          <span className='flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white'>
            Final: $139.99
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className='mb-6 flex items-center gap-2 rounded-xl bg-gray-50 p-3'
        >
          <HandCoins className='h-5 w-5 text-blue-600' />
          <span className='text-sm text-gray-700'>
            Earn up to 10% cash back. <span className='cursor-pointer font-semibold text-blue-600'>Join Now.</span>
          </span>
        </motion.div>
      </div>

      {/* Buy More Save More */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className='rounded-2xl border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-5'
      >
        <h3 className='mb-3 text-lg font-bold text-gray-900'>Buy More, Save More</h3>
        <div className='mb-3 grid grid-cols-4 gap-2'>
          {[
            { amount: '$20', save: '$20' },
            { amount: '$40', save: '$100' },
            { amount: '$100', save: '$200' },
            { amount: '$300', save: '$500' }
          ].map((item, idx) => (
            <div key={idx} className='rounded-lg bg-white p-2 text-center shadow-sm'>
              <div className='text-xs font-bold text-gray-900'>
                {item.amount} <span className='text-[10px]'>OFF</span>
              </div>
              <div className='text-[10px] text-gray-600'>{item.save}</div>
            </div>
          ))}
        </div>
        <div className='flex items-center justify-center gap-2 rounded-lg bg-white/50 p-2 text-xs'>
          <div className='flex gap-1'>
            <div className='rounded bg-orange-500 px-2 py-1 font-bold text-white'>02</div>
            <span className='pt-1 text-[10px] text-gray-600'>DAYS</span>
          </div>
          <span className='text-gray-600'>:</span>
          <div className='flex gap-1'>
            <div className='rounded bg-orange-500 px-2 py-1 font-bold text-white'>04</div>
            <span className='pt-1 text-[10px] text-gray-600'>HRS</span>
          </div>
          <span className='text-gray-600'>:</span>
          <div className='flex gap-1'>
            <div className='rounded bg-orange-500 px-2 py-1 font-bold text-white'>10</div>
            <span className='pt-1 text-[10px] text-gray-600'>MIN</span>
          </div>
          <span className='text-gray-600'>:</span>
          <div className='flex gap-1'>
            <div className='rounded bg-orange-500 px-2 py-1 font-bold text-white'>18</div>
            <span className='pt-1 text-[10px] text-gray-600'>SEC</span>
          </div>
        </div>
        <p className='mt-3 text-center text-xs text-gray-600'>
          Get $10 off automatically—buy more to save even more for back-to-school essentials!
        </p>
      </motion.div>

      {/* Product Features */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <ul className='space-y-2 text-sm text-gray-700'>
          <li className='flex items-start gap-2'>
            <span className='font-bold text-blue-500'>•</span>
            <span>Aluminum robot perfect for long-term use in classrooms and homeschooling.</span>
          </li>
          <li className='flex items-start gap-2'>
            <span className='font-bold text-blue-500'>•</span>
            <span>Use a smartphone, gamepad or auto-program to control. (Support Bluetooth & Wifi)</span>
          </li>
        </ul>
        <button
          onClick={() => setShowMore(!showMore)}
          className='mt-3 flex items-center gap-1 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700'
        >
          View More <ChevronDown className={`h-4 w-4 transition-transform ${showMore ? 'rotate-180' : ''}`} />
        </button>
      </motion.div>

      {/* Select Product */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        <h3 className='mb-3 text-lg font-bold text-gray-900'>Select the Product:</h3>
        <div className='grid grid-cols-2 gap-3 lg:grid-cols-3'>
          {products.map((product) => (
            <motion.button
              key={product.id}
              onClick={() => setSelectedProduct(product.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`rounded-xl border-1 p-4 text-sm font-medium transition-all ${
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
        <h3 className='mb-3 text-lg font-bold text-gray-900'>Classroom Bundle Options:</h3>
        <div className='space-y-3'>
          {bundles.map((bundle) => (
            <motion.button
              key={bundle.id}
              onClick={() => setSelectedBundle(bundle.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full rounded-xl border-1 p-4 text-left transition-all ${
                selectedBundle === bundle.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {bundle.badge && (
                <div className='mb-2'>
                  <span className='rounded-full bg-blue-500 px-3 py-1 text-xs font-bold text-white'>
                    {bundle.badge}
                  </span>
                </div>
              )}
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <Image src={bundle.image} alt='pro-img' width={60} height={60} className='rounded-lg' />
                  <div>
                    <div className='font-bold text-gray-900'>{bundle.name}</div>
                    {bundle.description && <div className='mt-1 text-xs text-gray-600'>{bundle.description}</div>}
                    {bundle.gift && <div className='mt-1 text-xs text-green-600'>• {bundle.gift}</div>}
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-lg font-bold text-gray-900'>${bundle.price}</div>
                  <div className='text-sm text-gray-400 line-through'>${bundle.originalPrice}</div>
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
        className='space-y-4'
      >
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2 rounded-full border border-gray-400 bg-white px-6 py-2'>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className='h-10 w-10 rounded-full bg-gray-100 text-xl font-bold shadow-sm transition-all hover:shadow-md'
            >
              -
            </button>
            <span className='w-12 text-center text-xl font-semibold'>{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className='h-10 w-10 rounded-full bg-gray-100 text-xl font-bold shadow-sm transition-all hover:shadow-md'
            >
              +
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className='flex-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 py-4 text-lg font-bold text-white shadow-xl shadow-blue-200 transition-all hover:shadow-2xl'
          >
            ADD TO CART
          </motion.button>
        </div>

        <p className='text-center text-xs text-gray-600'>
          Click <span className='cursor-pointer text-blue-600 underline'>here</span> to learn more about using a
          Purchase Order (PO).
        </p>
      </motion.div>

      {/* Delivery Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className='space-y-4 border-t border-gray-200 pt-6'
      >
        <div className='flex items-center gap-2 text-sm text-gray-700'>
          <Truck className='h-5 w-5 text-blue-600' />
          <span className='font-semibold'>Buy with Prime for a Faster Delivery</span>
        </div>

        <div className='rounded-xl bg-gray-50 p-4'>
          <div className='mb-3 flex items-center justify-between'>
            <span className='font-semibold text-gray-900'>Safe & Secure Checkout</span>
            <div className='flex gap-2'>
              <img src='https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg' alt='PayPal' className='h-5' />
              <img
                src='https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg'
                alt='Visa'
                className='h-5'
              />
              <img
                src='https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg'
                alt='Mastercard'
                className='h-5'
              />
            </div>
          </div>
          <div className='flex flex-wrap gap-2'>
            <span className='rounded bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700'>Paypal</span>
            <span className='rounded bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700'>Visa</span>
            <span className='rounded bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700'>Momo</span>
          </div>
        </div>

        <div className='rounded-xl border border-yellow-200 bg-yellow-50 p-4'>
          <div className='mb-2 flex items-center gap-2'>
            <Truck className='h-5 w-5 text-yellow-600' />
            <span className='font-semibold text-gray-900'>Ship in 2 Business Days</span>
          </div>
          <p className='mb-3 text-sm text-gray-700'>with Trusted Delivery</p>
          <div className='flex gap-2'>
            <img
              src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/320px-Amazon_logo.svg.png'
              alt='Amazon'
              className='h-6'
            />
            <img src='https://www.fedex.com/content/dam/fedex-com/logos/logo.png' alt='FedEx' className='h-6' />
            <img src='https://www.ups.com/assets/resources/webcontent/images/ups-logo.svg' alt='UPS' className='h-6' />
          </div>
        </div>

        <div className='rounded-xl border border-red-200 bg-red-50 p-4'>
          <p className='mb-2 text-sm text-gray-700'>
            <span className='font-bold'>We are currently only able to deliver products to the contiguous VietNam.</span>
          </p>
          <p className='mb-2 text-xs text-gray-600'>
            If you want to purchase products and deliver outside of the VN, we will forward your order to distributors
            to serve you.
          </p>
          <button className='text-xs font-semibold text-blue-600 underline'>Please leave your details.</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProductInfo
